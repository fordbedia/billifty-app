"use client";

import React, {
    createContext, Dispatch,
    ReactNode, SetStateAction,
    useContext,
    useState,
    useEffect,
	Suspense,
	useMemo
} from 'react'
import {
  useDisclosure
} from "@heroui/react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams, useParams } from "next/navigation";
import BusinessProfile from "@/app/models/BusinessProfile";
import Clients from "@/app/models/Clients";
import Invoices from "@/app/models/Invoices";
import { today, getLocalTimeZone } from "@internationalized/date";
import {computeInvoice} from "@/app/utils/computeInvoice";
import Invoice from "@/app/models/Invoices";
import Currency from "@/app/models/Currency";
import {toISO} from "@/app/utils/date";
import TemplateCategory from "@/app/models/TemplateCategory";
import Template from "@/app/models/Templates";
import ColorScheme from "@/app/models/ColorScheme";

const InvoiceContext = createContext(null)

function InvoiceProviderInner({ children, mode, initialId = null }) {
	const queryClient = useQueryClient()
	const router = useRouter();
	const searchParams = useSearchParams();
  	const clear = searchParams.get("clear");
	const params = useParams()

    const tz = getLocalTimeZone();

    const issueDateISO = toISO(today(tz));
	const dueDateISO = toISO(today(tz).add({ months: 1 }));

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

	const [selectedCurrency, setSelectedCurrency] = useState({})

    const [data, setData] = useState({
		id: null,
        business_profile_id: null,
        client_id: null,
        invoice_template_id: null,
        color_scheme_id: null,
        payment_information_id: null,
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
    })
	 const [hasShipping, setHasShipping] = useState(false)
	 const [isEmpty, setIsEmpty] = useState(false);
	 const [isTaxable, setIsTaxable] = useState((data.shipping_tax_rate ?? 0) > 0);

	const STORAGE_KEY = "billifty.invoice.form.v1";
	const STORAGE_VERSION = 1;

	const PERSIST_KEYS = new Set([
	  "business_profile_id","client_id","invoice_template_id","color_scheme_id",
	  "invoice_number","reference","shipping_address","currency_id",
	  "issued_on","due_on","paid_at","status","template_slug","template_version",
	  "theme_json","discount_mode","discount_cents","discount_rate",
	  "shipping_cents","shipping_tax_rate","notes","terms","meta",
	  "invoice_items"
	]);
	// totals like subtotal_cents, tax_cents, total_cents, amount_due_cents, shipping_tax_cents are recomputed
	const pickPersistable = (src) =>
	  Object.fromEntries(Object.entries(src).filter(([k]) => PERSIST_KEYS.has(k)));

	const invoiceId = initialId ?? params.id ?? null;
	const { isFetching} = useQuery({
		queryKey: ['invoice', invoiceId],
		enabled: !!invoiceId && mode !== 'new',
		queryFn: async () => {
			const inv = (await Invoices.find(invoiceId))?.data
			if (inv && Object.keys(inv).length > 0) {
				setData(prev => ({...prev, ...inv, invoice_items: [...inv.items]}))
			}
		}
	})

	const {isOpen: isOpenTemplate, onOpen: onOpenTemplate, onOpenChange: onOpenChangeTemplate} = useDisclosure();
	const {isOpen: isOpenColorScheme, onOpen: onOpenColorScheme, onOpenChange: onOpenChangeColorScheme} = useDisclosure();
	const {isOpen: isOpenConfirmIssueInvoice, onOpen: onOpenConfirmIssueInvoice, onOpenChange: onOpenChangeConfirmIssueInvoice} = useDisclosure();

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
        }
    })

    const {data: clientData} = useQuery({
        queryKey: ['client'],
        queryFn: async () => {
            const c = await Clients.all()
            if (c.data) {
                return c.data
            }
            return null
        }
    })

    const {data: generatedInvoiceNum} = useQuery({
        queryKey: ['auto-invoice-number'],
        queryFn: async () => (await Invoices.getAutoGeneratedInvoiceNumber())?.data
    })

	const { data: currencies } = useQuery({
		queryKey: ['currencies'],
		queryFn: async () => (await Currency.getAll())?.data
	})

    useEffect(() => {
        if (generatedInvoiceNum && !data.invoice_number) {
			setData((prevState) => ({
				...prevState,
				invoice_number: generatedInvoiceNum,
			}));
		}
		if (currencies && Object.keys(currencies).length > 0) {
			setSelectedCurrency((currencies.filter(f => f.code === 'USD')[0] || currencies[0]))
		}
    }, [generatedInvoiceNum, currencies])

    const onDataChange = (attr, val) => setData(prev => ({...prev, [attr]: val}))
    const onInvoiceItemChange = (attr, val) => setData(prev => ({
        ...prev,
        invoice_items: [...prev.invoice_items, ]
    }))

    const addItems = () => setData((prev) => ({...prev, invoice_items: [...prev.invoice_items, invoiceItemsInitialState]}))

    const updateItems = (index, field, value) => setData((prev) => {
        const updated = [...prev.invoice_items]
        updated[index] = {...updated[index], [field]: value}
        return {...prev, invoice_items: updated}
    })

	const removeItem = (index) => setData(prev => {
		const items = [...prev.invoice_items]
		items.splice(index, 1)
		return {...prev, invoice_items: items}
	})

	// Template Category
	const {data: templateCategoryData} = useQuery({
		queryKey: ['template-category'],
		queryFn: async () => (await TemplateCategory.getAll())?.data
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
		queryFn: async () => (await ColorScheme.getAll())?.data
	})

	// ----------------------------------------------------------------------------
	// Only fired if data.invoice_template_id is mutated to get the selected template
	// ----------------------------------------------------------------------------
	const {data: template} = useQuery({
		queryKey: ['template', data.invoice_template_id],
		queryFn: async () => (await Template.get(data.invoice_template_id))?.data,
		enabled: !!data.invoice_template_id, // only fetch when we have an id
	})

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
	  try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const payload = JSON.parse(raw);
		if (payload?.version !== STORAGE_VERSION) return;

		// Merge only persisted fields; leave computed fields as-is (they’ll recompute)
		setData((prev) => ({ ...prev, ...payload.data }));

		const storage = JSON.parse(raw);
		setIsEmpty(!storage?.data);
	  } catch (_) {
		// ignore corrupted LS
	  }
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// Syncs data when fields are updated
	useEffect(() => {
	  let t = setTimeout(() => {
		try {
		  const payload = { version: STORAGE_VERSION, data: pickPersistable(data) };
		  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch (_) { /* ignore quota / serialization issues */ }
	  }, 400); // debounce so we don’t hammer LS while typing
	  return () => clearTimeout(t);
	}, [
	  // Only track fields you actually persist:
	  data.business_profile_id, data.client_id, data.invoice_template_id, data.color_scheme_id,
	  data.invoice_number, data.reference, data.shipping_address, data.currency_id,
	  data.issued_on, data.due_on, data.paid_at, data.status, data.template_slug, data.template_version,
	  data.theme_json, data.discount_mode, data.discount_cents, data.discount_rate,
	  data.shipping_cents, data.shipping_tax_rate, data.notes, data.terms, data.meta,
	  data.invoice_items,
	]);
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

	useEffect(() => {
	  const has =
		// Non-empty shipping address
		(data.shipping_address && data.shipping_address.trim() !== "") ||
		// Any non-zero shipping cost
		(data.shipping_cents ?? 0) > 0 ||
		// Any non-zero shipping tax rate
		(data.shipping_tax_rate ?? 0) > 0;

	  setHasShipping(has);
	  const isTaxable = (data.shipping_tax_rate ?? 0) > 0;
	  setIsTaxable(isTaxable)
	}, [data.shipping_address, data.shipping_cents, data.shipping_tax_rate]);

	const clearSticky = () => router.replace('/app/invoice/new?clear=true');

	const {mutate: saveDraft} = useMutation({
		mutationFn: async (action) => {
			const payload = computeInvoice(data);
			const r = await Invoice.saveDraft(payload, action)
			setData(prev => ({...prev, status: r?.data?.status}))
		}
	})

	const {mutate: update} = useMutation({
		mutationFn: async (action) => {
			const payload = computeInvoice(data);
			const response = await Invoice.update(invoiceId, payload, action)
			setData(prev => ({...prev, status: response?.data?.status}))
		}
	})

	const save = (type) => {
		switch(type) {
			case 'save_draft':
				saveDraft(type)
				break;
			case 'save_changes':
			case 'issue':
				update(type)
				break;
		}
	}

	// ----------------------------------------------------------------------------
	// Finally, removed sticky forms, when clearSticky() is clicks
	// ----------------------------------------------------------------------------
	useEffect(() => {
		if (clear === "true") {
			window.localStorage.removeItem(STORAGE_KEY)

			setTimeout(() => {
				window.location.href = '/app/invoice/new';
			}, 200)
		}
	}, [clear]);

    const value = {
        businessProfileData,
        clientData,
        generatedInvoiceNum,
        data,
        onDataChange,
        addItems,
        updateItems,
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
    }

    return <InvoiceContext.Provider value={value}>
        {children}
    </InvoiceContext.Provider>
}

export function InvoiceProvider({children}) {
	return (
		<Suspense fallback={null}>
			<InvoiceProviderInner>{children}</InvoiceProviderInner>
		</Suspense>
	)
}

export const useInvoice = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
};