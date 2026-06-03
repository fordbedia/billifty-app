"use client";

import React, {
	createContext, Dispatch,
	ReactNode, SetStateAction,
	useContext,
	useState,
	useEffect,
	Suspense,
	useMemo, use
} from 'react'
import {
	useDisclosure
} from "@heroui/react";
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import {useRouter, useSearchParams, useParams, usePathname} from "next/navigation";
import BusinessProfile from "@/app/models/BusinessProfile";
import Clients from "@/app/models/Clients";
import Invoices from "@/app/models/Invoices";
import {today, getLocalTimeZone} from "@internationalized/date";
import {computeInvoice} from "@/app/utils/computeInvoice";
import Invoice from "@/app/models/Invoices";
import Currency from "@/app/models/Currency";
import {toISO} from "@/app/utils/date";
import TemplateCategory from "@/app/models/TemplateCategory";
import Template from "@/app/models/Templates";
import ColorScheme from "@/app/models/ColorScheme";
import {addToast} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

const InvoiceContext = createContext(null)

function InvoiceProviderInner({children, mode, initialId = null}) {
	const queryClient = useQueryClient()
	const router = useRouter();
	const searchParams = useSearchParams();
	const clear = searchParams.get("clear");
	const params = useParams()
	const pathname = usePathname()

	const tz = getLocalTimeZone();

	const issueDateISO = toISO(today(tz));
	const dueDateISO = null;

	const invoiceItemsInitialState = {
		position: 1,
		name: '',
		description: '',
		quantity: 1,
		unit: '',
		unit_price_cents: 0,
		line_discount_cents: 0,
		line_discount_rate: 0,
		tax_rate: 0,
		tax_cents: 0,
		line_total_cents: 0,
		meta: ''
	}

	const makeSortableId = () => {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID()
		}

		return `invoice-item-${Date.now()}-${Math.random().toString(36).slice(2)}`
	}

	const withSortableIds = (items) =>
		items.map((item) => item?._sortable_id ? item : {...item, _sortable_id: makeSortableId()})

	const initialState = {
		id: null,
		business_profile_id: null,
		client_id: null,
		invoice_template_id: null,
		color_scheme_id: null,
		invoice_number: '',
		reference: '',
		shipping_address: '',
		currency_id: 1,
		issued_on: issueDateISO,
		due_on: dueDateISO,
		paid_at: '',
		status: '',
		template_slug: '',
		template_version: '',
		theme_json: '',
		subtotal_cents: 0,
		discount_mode: 'none',
		discount_cents: 0,
		discount_rate: 0,
		tax_cents: 0,
		shipping_cents: 0,
		shipping_tax_rate: 0,
		shipping_tax_cents: 0,
		total_cents: 0,
		amount_due_cents: 0,
		notes: '',
		terms: '',
		pdf_url: '',
		render_snapshot_html: '',
		meta: '',
		invoice_items: [],
	};
	const toastInitialState = {
		title: '',
		message: '',
		color: 'primary'
	}

	const exportOptionInitialState = {
		selectedOption: '',
		status: null,
		payload: {
			message: `Hi {{client.name}},
				<br /><br />
				I'm sharing invoice {{invoice.number}} with you in the attached file. If anything needs adjustment or if you have any questions, just let me know—I’m here to assist.
				<br /><br />
				Warm regards,<br />
				{{businessProfile.name}}`,
			cc: ''
		}
	}

	const [exportMessage, setExportMessage] = useState(exportOptionInitialState.payload.message);

	const [toGenerateANdDownload, setToGenerateANdDownload] = useState(false);
	const [pollCount, setPollCount] = useState(0);
	const MAX_PDF_POLL_COUNT = 80; // ~2 minutes at 1.5s interval

	const [selectedCurrency, setSelectedCurrency] = useState({})
	const [exportOption, setExportOption] = useState(exportOptionInitialState)
	const [hasCsvReport, setHasCsvReport] = useState(false)

	const [data, setData] = useState({...initialState})
	const [hasShipping, setHasShipping] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false);
	const [isTaxable, setIsTaxable] = useState((data.shipping_tax_rate ?? 0) > 0);
	const [hasToast, setHasToast] = useState(toastInitialState)

	const STORAGE_KEY = "billifty.invoice.form.v1";
	const STORAGE_VERSION = 1;

	// ----------------------------------------------------------------------------
	// Fetch all users invoice
	// ----------------------------------------------------------------------------
	const [dateRange, setDateRange] = useState(null)
	const [search, setSearch] = useState(null)
	const [appliedSearch, setAppliedSearch] = useState("");
	const hasRange = !!dateRange?.start && !!dateRange?.end;
	const hasSearch = appliedSearch.trim().length > 0
	const handleDateRangeChange = (newRange) => setDateRange(newRange);
	const handleSearchKeyDown = (e) => {
		if (e.key === "Enter") {
			setAppliedSearch(search);    // 👈 trigger query update
			setInvoicePage(1);           // optional: reset pagination
		}
	}
	const [invoicePage, setInvoicePage] = useState(1);
	const {data: userInvoices} = useQuery({
		queryKey: ['user-invoice', invoicePage,
			hasRange
				? {
					start: dateRange.start.toString(), // e.g. "2025-11-16"
					end: dateRange.end.toString(),
				}
				: null,
			hasSearch
				? appliedSearch.trim()
				: null,
		],
		enabled: pathname === '/app/invoices',
		queryFn: async () => {
			const params = {
				page: invoicePage
			}
			if (hasRange) {
				params.start_date = dateRange.start?.toString();
				params.end_date = dateRange.end?.toString();
			}
			if (hasSearch) {
				params.search = appliedSearch.trim()
			}
			return (await Invoice.invoices(params))?.data
		},
		retry: false,
	})

	const PERSIST_KEYS = new Set([
		"business_profile_id", "client_id", "invoice_template_id", "color_scheme_id",
		"invoice_number", "reference", "shipping_address", "currency_id",
		"issued_on", "due_on", "paid_at", "status", "template_slug", "template_version",
		"theme_json", "discount_mode", "discount_cents", "discount_rate",
		"shipping_cents", "shipping_tax_rate", "notes", "terms", "meta",
		"invoice_items"
	]);
	// totals like subtotal_cents, tax_cents, total_cents, amount_due_cents, shipping_tax_cents are recomputed
	const pickPersistable = (src) =>
		Object.fromEntries(Object.entries(src).filter(([k]) => PERSIST_KEYS.has(k)));

	const invoiceId = initialId ?? params.id ?? null;
	const {isFetchingdata, data: fetchedInvoice, isError: isInvoiceError, isLoading: isLoadingInvoice} = useQuery({
		queryKey: ['invoice', invoiceId],
		enabled: !!invoiceId && mode !== 'new',
		queryFn: async () => {
			const inv = (await Invoices.find(invoiceId))?.data;
			return inv ?? null;
		},
		retry: false,
		refetchInterval: toGenerateANdDownload ? 1500 : false,
		refetchIntervalInBackground: true,
	})

	const {isOpen: isOpenTemplate, onOpen: onOpenTemplate, onOpenChange: onOpenChangeTemplate} = useDisclosure();
	const {isOpen: isOpenColorScheme, onOpen: onOpenColorScheme, onOpenChange: onOpenChangeColorScheme} = useDisclosure();
	const {
		isOpen: isOpenConfirmIssueInvoice,
		onOpen: onOpenConfirmIssueInvoice,
		onOpenChange: onOpenChangeConfirmIssueInvoice
	} = useDisclosure();
	const {
		isOpen: isOpenConfirmDeleteModal,
		onOpen: onOpenConfirmDeleteModal,
		onOpenChange: onOpenChangeConfirmDeleteModal
	} = useDisclosure();
	const {
		isOpen: isOpenPreviewInvoiceModal,
		onOpen: onOpenPreviewInvoiceModal,
		onOpenChange: onOpenChangePreviewInvoiceModal
	} = useDisclosure();

	const shallowEqualNumbers = (a, b, keys) => {
		return keys.every(k => (a?.[k] ?? null) === (b?.[k] ?? null));
	}

	const {
		data: businessProfileData
	} = useQuery({
		queryKey: ['business-profiles'],
		queryFn: async () => {
			const a = await BusinessProfile.all()
			if (a.data) {
				return a.data
			}
			return null
		},
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	const {data: clientData} = useQuery({
		queryKey: ['client'],
		queryFn: async () => {
			const c = await Clients.all()
			if (c.data) {
				return c.data
			}
			return null
		},
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	const {data: generatedInvoiceNum} = useQuery({
		queryKey: ['auto-invoice-number'],
		queryFn: async () => (await Invoices.getAutoGeneratedInvoiceNumber())?.data,
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	const {data: currencies} = useQuery({
		queryKey: ['currencies'],
		queryFn: async () => (await Currency.getAll())?.data,
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	useEffect(() => {
		if (generatedInvoiceNum && !data.invoice_number) {
			setData((prevState) => ({
				...prevState,
				invoice_number: generatedInvoiceNum,
			}));
		}
		// Only set if the fetch invoice is not available
		if (currencies && Object.keys(currencies).length > 0 && !fetchedInvoice?.currency) {
			setSelectedCurrency((currencies.filter(f => f.code === 'USD')[0] || currencies[0]))
		}
	}, [generatedInvoiceNum, currencies])

	const onDataChange = (attr, val) => setData(prev => ({...prev, [attr]: val}))
	const onInvoiceItemChange = (attr, val) => setData(prev => ({
		...prev,
		invoice_items: [...prev.invoice_items,]
	}))

	const withItemPositions = (items) =>
		withSortableIds(items).map((item, index) => ({...item, position: index + 1}))

	const addItems = () => setData((prev) => ({
		...prev,
		invoice_items: withItemPositions([...prev.invoice_items, {
			...invoiceItemsInitialState,
			_sortable_id: makeSortableId()
		}])
	}))

	const updateItems = (index, field, value) => setData((prev) => {
		const updated = [...prev.invoice_items]
		updated[index] = {...updated[index], [field]: value}
		return {...prev, invoice_items: updated}
	})

	const removeItem = (index) => setData(prev => {
		const items = [...prev.invoice_items]
		items.splice(index, 1)
		return {...prev, invoice_items: withItemPositions(items)}
	})

	const reorderItems = (itemsOrFromIndex, toIndex) => setData(prev => {
		if (Array.isArray(itemsOrFromIndex)) {
			return {...prev, invoice_items: withItemPositions(itemsOrFromIndex)}
		}

		const fromIndex = itemsOrFromIndex

		if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
			return prev
		}

		const items = [...prev.invoice_items]
		if (fromIndex >= items.length || toIndex >= items.length) {
			return prev
		}

		const [movedItem] = items.splice(fromIndex, 1)
		items.splice(toIndex, 0, movedItem)

		return {...prev, invoice_items: withItemPositions(items)}
	})

	// Template Category
	const {data: templateCategoryData} = useQuery({
		queryKey: ['template-category'],
		queryFn: async () => (await TemplateCategory.getAll())?.data,
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	const {mutate: templateData, data: templates} = useMutation({
		mutationFn: async (id) => (await Template.getAllByCategory(id))?.data,
	})

	const loadTemplates = (id) => {
		onOpenTemplate()
		templateData(id)
	}

	const [selectedTemplate, setSelectedTemplate] = useState({})
	const [selectedColorScheme, setSelectedColorScheme] = useState({})

	const {data: colorSchemeData} = useQuery({
		queryKey: ['color-scheme'],
		queryFn: async () => (await ColorScheme.getAll())?.data,
		retry: false,
		enabled: !!invoiceId || !!(mode === 'edit' || mode === 'new')
	})

	// ----------------------------------------------------------------------------
	// Only fired if data.invoice_template_id is mutated to get the selected template
	// ----------------------------------------------------------------------------
	const {data: template} = useQuery({
		queryKey: ['template', data.invoice_template_id],
		queryFn: async () => (await Template.get(data.invoice_template_id))?.data,
		enabled: !!data.invoice_template_id, // only fetch when we have an id
	})

	// ----------------------------------------------------------------------------
	// Start: Send Invoice Logic: PDF Export
	// ----------------------------------------------------------------------------
	// Download PDF
	const {mutate: generatePdf} = useMutation({
		mutationFn: async () => {
			setExportOption(prev => ({...prev, status: 'processing'}))
			return (await Invoices.generate(invoiceId))?.data
		},
		onSuccess: (data) => {
			// data is your API response -> { data: invoice }
			const invoiceFromApi = data?.data ?? data;

			// 1) Optimistically sync the React Query cache
			queryClient.setQueryData(['invoice', invoiceId], (old) => ({
				...(old ?? {}),
				...invoiceFromApi,
				pdf_status: invoiceFromApi.pdf_status ?? 'queued',
				pdf_error: null,
			}));

			// 2) Start polling
			setPollCount(0);
			setToGenerateANdDownload(true);
		},
	});

	async function downloadInvoicePdf(invoiceId) {
		const res = await Invoices.download(invoiceId);
		// Try to read filename from headers (optional)
		const contentDisposition = res.headers["content-disposition"];
		let filename = `invoice-${invoiceId}.pdf`;

		if (contentDisposition) {
			const match = contentDisposition.match(/filename="?([^"]+)"?/);
			if (match && match[1]) {
				filename = match[1];
			}
		}

		const blob = new Blob([res.data], {type: "application/pdf"});
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.setAttribute("download", filename);
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	}

	useEffect(() => {
		if (!toGenerateANdDownload || !fetchedInvoice) return;

		const status = fetchedInvoice.pdf_status;

		if (status === "ready") {
			setToGenerateANdDownload(false);
			downloadInvoicePdf(invoiceId);
			setExportOption(prev => ({...prev, status: 'done'}));
		} else if (status === "failed") {
			setToGenerateANdDownload(false);
			setExportOption(prev => ({...prev, status: null}));
			addToast({
				title: "Invoice PDF generation failed",
				description: fetchedInvoice?.pdf_error ?? "Please try again.",
				color: "danger",
			});
		} else {
			// queued/processing
			setPollCount((prev) => {
				const next = prev + 1;
				if (next >= MAX_PDF_POLL_COUNT) {
					setToGenerateANdDownload(false);
					setExportOption(prevState => ({...prevState, status: null}));
					addToast({
						title: "PDF generation is taking longer than expected",
						description: "Please try again in a moment.",
						color: "warning",
					});
				}
				return next;
			});
		}
	}, [fetchedInvoice, toGenerateANdDownload, invoiceId, MAX_PDF_POLL_COUNT]);
	// Send Copy to my email
	const {mutate: sendCopyToMyEmail} = useMutation({
		mutationFn: async () => {
			setExportOption(prev => ({...prev, status: 'processing'}))
			return (await Invoice.sendCopyToBusinessProfile(invoiceId, hasCsvReport))?.data
		},
		onSuccess: () => {
			setExportOption(prev => ({...prev, status: 'done'}))
		}
	})

	const {mutate: sendToClient} = useMutation({
		mutationFn: async () => {
			setExportOption(prev => ({...prev, status: 'processing'}))
			return (await Invoice.directlySendToClient(invoiceId, exportMessage))
		},
		onSuccess: () => {
			setExportOption(prev => ({...prev, status: 'done'}))
			setExportMessage(exportOptionInitialState.payload.message)
		}
	})
	// ----------------------------------------------------------------------------
	// End: Send Invoice Logic: PDF Export
	// ----------------------------------------------------------------------------


	const loadThemeSelector = (id = null) => {
		const hasTemplate = selectedTemplate && Object.keys(selectedTemplate).length > 0;
		const hasColorScheme = selectedColorScheme && Object.keys(selectedColorScheme).length > 0;

		if (!hasTemplate && !hasColorScheme && id) {
			onOpenTemplate()
			templateData(id)
		} else if (hasTemplate && !hasColorScheme) {
			onOpenColorScheme()
		} else {
			setSelectedTemplate({})
			setSelectedColorScheme({})
		}
	}

	const invoiceComputed = useMemo(
		() => computeInvoice(data),
		[
			data.invoice_items,
			data.discount_mode,
			data.discount_cents,
			data.discount_rate,
			data.tax_rate_bps,
			data.shipping_cents,
			data.shipping_tax_rate,
		]
	);

	const invoiceItemsFrom = (invoice) => invoice?.items ?? invoice?.invoice_items ?? [];

	// ----------------------------------------------------------------------------
	// Build the save/update payload without accidentally zeroing invoice totals.
	// In edit mode the invoice header can hydrate before line items are available; if we
	// run computeInvoice() against an empty local item list, it recalculates totals as 0
	// and overwrites valid DB totals. Once items are present, computeInvoice() remains the
	// source of truth so frontend totals stay aligned with the backend calculator.
	// ----------------------------------------------------------------------------
	const buildInvoicePayload = () => {
		if ((data.invoice_items ?? []).length === 0) {
			return data;
		}

		return computeInvoice(data);
	}

	// ----------------------------------------------------------------------------
	// Sync invoice data with selected template and color scheme
	// Updates invoice_template_id and color_scheme_id when user makes a selection.
	// ----------------------------------------------------------------------------
	useEffect(() => {
		if (!selectedTemplate && !selectedColorScheme) return;
		setData(prev => {
			const next = {...prev}

			if (selectedTemplate?.id) {
				next.invoice_template_id = selectedTemplate.id
			}
			if (selectedColorScheme?.id) {
				next.color_scheme_id = selectedColorScheme.id
			}

			return next;
		})
	}, [selectedTemplate, selectedColorScheme]);

	// ----------------------------------------------------------------------------
	// STICKY FORMS
	// ----------------------------------------------------------------------------
	// Sync data on page load
	useEffect(() => {
		if (mode === 'new') {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (!raw) return;
				const payload = JSON.parse(raw);
				if (payload?.version !== STORAGE_VERSION) return;

				// Merge only persisted fields; leave computed fields as-is (they’ll recompute)
				setData((prev) => ({...prev, ...payload.data}));

				const storage = JSON.parse(raw);
				setIsEmpty(!storage?.data);
			} catch (_) {
				// ignore corrupted LS
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// Syncs data when fields are updated
	useEffect(() => {
		if (mode === 'new') {
			let t = setTimeout(() => {
				try {
					const payload = {version: STORAGE_VERSION, data: pickPersistable(data)};
					window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
				} catch (_) { /* ignore quota / serialization issues */
				}
			}, 400); // debounce so we don’t hammer LS while typing
			return () => clearTimeout(t);
		}
	}, [
		// Only track fields you actually persist:
		data.business_profile_id, data.client_id, data.invoice_template_id, data.color_scheme_id,
		data.invoice_number, data.reference, data.shipping_address, data.currency_id,
		data.issued_on, data.due_on, data.paid_at, data.status, data.template_slug, data.template_version,
		data.theme_json, data.discount_mode, data.discount_cents, data.discount_rate,
		data.shipping_cents, data.shipping_tax_rate, data.notes, data.terms, data.meta,
		data.invoice_items,
	]);

	useEffect(() => {
		if (!fetchedInvoice) return;

		// Merge server invoice into local form state
		setData((prev) => ({
			...prev,
			...fetchedInvoice,
			invoice_items: withItemPositions([...invoiceItemsFrom(fetchedInvoice)]),
		}));

		// Optional: derive flags from fetched invoice once
		if (fetchedInvoice.shipping_address || fetchedInvoice.shipping_cents) {
			setHasShipping(true);
		}
		const shippingIsTaxable = Boolean(parseInt(fetchedInvoice.shipping_tax_rate))
		if (shippingIsTaxable) {
			setIsTaxable(true);
		}
		if (fetchedInvoice?.currency) {
			setSelectedCurrency(fetchedInvoice?.currency)
		}
	}, [fetchedInvoice]);

	// ----------------------------------------------------------------------------
	// Updates the template and color scheme display
	// Sync the template into the selectedTemplate and selectedColorScheme
	// ----------------------------------------------------------------------------
	useEffect(() => {
		if (template) {
			setSelectedTemplate(template)
		}
		if (colorSchemeData) {
			const colorScheme = colorSchemeData.find(f => f.id === data.color_scheme_id)
			setSelectedColorScheme(colorScheme)
		}
	}, [template, colorSchemeData])

	const clearSticky = () => {
		setData({...initialState, invoice_number: generatedInvoiceNum})
		setSelectedTemplate({})
		setSelectedColorScheme({})
		window.localStorage.removeItem(STORAGE_KEY)
		router.replace('/app/invoice/new?clear=true');
	}

	const {mutate: saveDraft, error: createInvoiceError} = useMutation({
		mutationFn: async (action) => {
			const payload = buildInvoicePayload();
			return await Invoice.saveDraft(payload, action)
		},
		onSuccess: (r) => {
			if (r && r.data) {
				window.localStorage.removeItem(STORAGE_KEY)
				setData(prev => ({...prev, status: r?.data?.status}))
				setHasToast({
					title: 'Invoice was successfully created!',
					color: 'success'
				})
				queryClient.invalidateQueries({queryKey: ['me']})
				router.replace(`/app/invoice/${r.data?.id}`)
			}
		}
	})

	const {mutate: update, error: updateError} = useMutation({
		mutationFn: async (action) => {
			const payload = buildInvoicePayload();
			return await Invoice.update(invoiceId, payload, action)
		},
		onSuccess: (r) => {
			if (r && r.data) {
				setData(prev => ({...prev, status: r?.data?.status}))
				setHasToast({
					title: `Invoice was successfully ${r?.data?.action}!`,
					color: r?.data?.action === 'issued' ? 'secondary' : 'success'
				})
			}
		}
	})

	const {mutate: deleteInvoice} = useMutation({
		mutationFn: async () => (await Invoices.delete(invoiceId)).data,
		onSuccess: () => {
			setHasToast({
				title: 'Invoice was successfully deleted!',
				color: 'danger'
			})
			router.replace(uri.invoices)
		}
	})

	const save = (type, callback = null) => {
		switch (type) {
			case 'save_draft':
				saveDraft(type)
				break;
			case 'save_changes':
			case 'issue':
				update(type)
				break;
		}

		if (callback) {
			callback()
		}
	}

	// ----------------------------------------------------------------------------
	// Finally, removed sticky forms, when clearSticky() is clicks
	// ----------------------------------------------------------------------------
	useEffect(() => {
		if (clear === "true") {
			setData({...initialState, invoice_number: generatedInvoiceNum})
			setSelectedTemplate({})
			setSelectedColorScheme({})
			window.localStorage.removeItem(STORAGE_KEY)
			setTimeout(() => {
				window.location.href = '/app/invoice/new';
			}, 500)
		}
	}, [clear]);

	useEffect(() => {
		if (typeof hasToast !== 'undefined' && Object.keys(hasToast).length > 0 && hasToast.title !== '') {
			addToast({
				title: hasToast.title,
				description: hasToast.message ?? null,
				hideIcon: true,
				color: hasToast.color,
				timeout: 4000
			});
		}
	}, [hasToast])

	const value = {
		businessProfileData,
		clientData,
		generatedInvoiceNum,
		data,
		onDataChange,
		addItems,
		updateItems,
		reorderItems,
		setHasShipping,
		hasShipping,
		isTaxable,
		setIsTaxable,
		removeItem,
		save,
		currencies,
		setSelectedCurrency,
		selectedCurrency,
		isOpenTemplate,
		loadTemplates,
		loadThemeSelector,
		onOpenChangeTemplate,
		templateCategoryData,
		templates,
		setSelectedTemplate,
		selectedTemplate,
		colorSchemeData,
		isOpenColorScheme,
		onOpenColorScheme,
		setSelectedColorScheme,
		selectedColorScheme,
		onOpenChangeColorScheme,
		clearSticky,
		isEmpty,
		onOpenConfirmIssueInvoice,
		onOpenChangeConfirmIssueInvoice,
		isOpenConfirmIssueInvoice,
		invoiceComputed,
		invoiceId,
		router,
		isInvoiceError,
		createInvoiceError,
		userInvoices,
		updateError,
		invoicePage,
		setInvoicePage,
		handleDateRangeChange,
		handleSearchKeyDown,
		setSearch,
		isLoadingInvoice,
		isOpenConfirmDeleteModal, onOpenConfirmDeleteModal, onOpenChangeConfirmDeleteModal,
		deleteInvoice,
		isOpenPreviewInvoiceModal, onOpenPreviewInvoiceModal, onOpenChangePreviewInvoiceModal,
		generatePdf,
		exportOption, setExportOption,
		sendCopyToMyEmail, exportMessage, setExportMessage, sendToClient, hasCsvReport, setHasCsvReport
	}

	return <InvoiceContext.Provider value={value}>
		{children}
	</InvoiceContext.Provider>
}

export function InvoiceProvider({children, initialId, mode}) {
	return (
		<Suspense fallback={null}>
			<InvoiceProviderInner initialId={initialId} mode={mode}>{children}</InvoiceProviderInner>
		</Suspense>
	)
}

export const useInvoice = () => {
	const ctx = useContext(InvoiceContext);
	if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
	return ctx;
};
