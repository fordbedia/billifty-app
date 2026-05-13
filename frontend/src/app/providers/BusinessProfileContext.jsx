"use client";

import {createContext, useContext, useEffect, useRef, useState} from "react";
import {Exception} from "sass";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import BusinessProfile from "@/app/models/BusinessProfile";
import { useRouter, useSearchParams, useParams, usePathname } from "next/navigation";
import {useDisclosure} from "@heroui/react";
import {addToast} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

export const BusinessProfileContext = createContext()

export function BusinessProfileProvider({ children, id, mode }) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const paymentInfoInitialState = {
		user_id: '',
		payment_method: '',
		payment_methods: [],
		payment_information_ids: {},
		bank_name: '',
		account_name: '',
		account_number: '',
		routing_number: '',
		iban: '',
		swift_code: '',
		paypal_email: '',
		cash_app: '',
		stripe_account_id: '',
		notes: '',
		is_test: '',
		created_at: '',
		updated_at: '',
	}

	const businessProfileInitialState = {
		user_id: '',
		payment_information_id: '',
		name: '',
		legal_name: '',
		email: '',
		phone: '',
		website: '',
		tax_id: '',
		license_no: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
		logo_path: '',
		branding_json: '',
		is_test: '',
	}
	const initialToastState = {
		title: '',
		message: '',
		color: 'primary',
	}
	const queryClient = useQueryClient()
	const [hasToast, setHasToast] = useState(initialToastState)
	const [businessProfileForm, setBusinessProfileForm] = useState({...businessProfileInitialState})
	const [paymentInfoForm, setPaymentInfoForm] = useState({...paymentInfoInitialState})
	const [search, setSearch] = useState(null)
	const [appliedSearch, setAppliedSearch] = useState("");
	const [errors, setErrors] = useState(null)
	const [isRedirectingAfterCreateOrSave, setIsRedirectingAfterCreateOrSave] = useState(false)
	const {
		isOpen: isOpenConfirmDeleteModal,
		onOpen: onOpenConfirmDeleteModal,
		onOpenChange: onOpenChangeConfirmDeleteModal
	} = useDisclosure();

	const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

	const [businessProfilePage, setBusinessProfilePage] = useState(1)
	const hasSearch = appliedSearch.trim();
	const {data: businessProfileData} = useQuery({
		queryKey: ['business-profiles', businessProfilePage,
			hasSearch
				? appliedSearch.trim()
				: null,
		],
		queryFn: async () => {
			const params = {
					page: businessProfilePage
			}
			if (hasSearch) {
				params.search = appliedSearch.trim()
			}
			return (await BusinessProfile.paginate(params))?.data
		},
		retry: false,
		enabled: pathname === '/app/invoice/business-profile'
	})

	const handleSearchKeyDown = (e) => {
		if (e.key === "Enter") {
			setAppliedSearch(search);    // 👈 trigger query update
			setBusinessProfilePage(1);           // optional: reset pagination
		}
	}

	// ----------------------------------------------------------------------------
	// Pull data for edit
	// ----------------------------------------------------------------------------
	const {data, isError, isLoading} = useQuery({
		queryKey: ['business-profile', id],
		queryFn: async () => (await BusinessProfile.show(id))?.data,
		retry: false,
		enabled: !!id
	})

	const handleFormChange = (table, attr, value) => {
		switch(table) {
			case 'bp':
				setBusinessProfileForm((prev) => ({...prev, [attr]: value}))
				break;
			case 'pi':
				setPaymentInfoForm((prev) => ({...prev, [attr]: value}))
				break;
		}
	}

	const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
		setBusinessProfileForm(prev => ({...prev, logo_path: file}))
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Pass file up if needed
    onChange?.(file);
  };

	const paymentMethods = [
		{key: 'bank_transfer', label: 'Bank Transfer'},
		{key: 'paypal', label: 'PayPal'},
		{key: 'stripe', label: 'Stripe'},
		{key: 'cash_app', label: 'Cash App'}
	];

	const normalizePaymentMethodKey = (method) => {
		if (!method) {
			return '';
		}

		const value = String(method).trim().toLowerCase();
		const labels = {
			'bank transfer': 'bank_transfer',
			paypal: 'paypal',
			stripe: 'stripe',
			'cash app': 'cash_app',
		};

		return labels[value] ?? value;
	}

	const normalizePaymentInfos = (profileData) => {
		const paymentInformations = Array.isArray(profileData?.payment_informations) && profileData.payment_informations.length > 0
			? profileData.payment_informations
			: [];

		const nextPaymentInfo = {...paymentInfoInitialState};
		const selectedMethods = [];
		const paymentInfoIds = {};

		paymentInformations.forEach((paymentInfo) => {
			const method = normalizePaymentMethodKey(paymentInfo?.payment_method);

			if (!method) {
				return;
			}

			selectedMethods.push(method);

			if (paymentInfo?.id) {
				paymentInfoIds[method] = paymentInfo.id;
			}

			Object.entries(paymentInfo).forEach(([key, value]) => {
				if (value !== undefined && value !== null && key in nextPaymentInfo) {
					nextPaymentInfo[key] = value;
				}
			});
		});

		const uniqueMethods = [...new Set(selectedMethods)];

		return {
			...nextPaymentInfo,
			payment_methods: uniqueMethods,
			payment_method: uniqueMethods[0] ?? '',
			payment_information_ids: paymentInfoIds,
		};
	}

	const handlePaymentMethodsChange = (methods) => {
		const selectedMethods = [...new Set((methods ?? []).map(normalizePaymentMethodKey).filter(Boolean))];

		setPaymentInfoForm((prev) => ({
			...prev,
			payment_methods: selectedMethods,
			payment_method: selectedMethods[0] ?? '',
		}));
	}

	const appendBusinessProfileFormData = (formData) => {
		Object.entries(businessProfileForm).forEach(([key, val]) => {
			if (val === undefined || val === null || Array.isArray(val)) {
				return;
			}

			if (typeof val === 'object' && !(typeof File !== 'undefined' && val instanceof File)) {
				return;
			}

			formData.append(key, val)
		})
	}

	const appendPaymentInformationFormData = (formData) => {
		Object.entries(paymentInfoForm).forEach(([key, val]) => {
			if (val === undefined || val === null) {
				return;
			}

			if (Array.isArray(val) || (typeof val === 'object' && !(typeof File !== 'undefined' && val instanceof File))) {
				formData.append(`paymentInfo[${key}]`, JSON.stringify(val));
				return;
			}

			formData.append(`paymentInfo[${key}]`, val);
		})
	}

	const {mutate: submitForm, error: errorSubmit} = useMutation({
		mutationFn: async () => {
			const formData = new FormData();

			appendBusinessProfileFormData(formData)
			appendPaymentInformationFormData(formData)

			return await BusinessProfile.create(formData)
		},
		onSuccess: () => {
			setHasToast({title: 'New business profile has been successfully created!', color: 'success'})
			if (searchParams.get('from') === 'onboarding') {
				router.replace(uri.onboarding)
			} else {
				router.replace(`${uri.business_profile.lists}?refreshMe=1`)
			}
		}
	})

	useEffect(() => {
    if (searchParams.get("refreshMe") === "1") {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      router.replace(uri.business_profile.lists);
    }
  }, [searchParams, queryClient, router]);

	useEffect(() => {
		if (data && Object.keys(data).length > 0) {
			const bp = { ...data };
			delete bp.payment_informations

			setBusinessProfileForm(bp)
			setPaymentInfoForm(normalizePaymentInfos(data))

			if (bp.logo_path) {
				console.log('sdfdf', `/storage/${bp.logo_path}`)
				setPreview(`/storage/${bp.logo_path}`)
			} else {
				setPreview(null)
			}
		}
	}, [data]);

	const {mutate: edit, error: errorUpdate} = useMutation({
		mutationFn: async () => {
			const formData = new FormData()

			appendBusinessProfileFormData(formData)
			appendPaymentInformationFormData(formData)

			return await BusinessProfile.update(id, formData)
		},
		onSuccess: () => {
			setIsRedirectingAfterCreateOrSave(true)
			setHasToast({title: 'Business profile has been successfully modified!', color: 'success'})
			router.replace(uri.business_profile.lists)
		}
	})

	const save = () => {
		switch(mode) {
			case 'new':
				submitForm()
				break;
			case 'edit':
				edit()
				break;
		}
	}

	const {mutate: deleteBusinessProfile} = useMutation({
		mutationFn: async () => (await BusinessProfile.archive(id)),
		onSuccess: () => {
			setHasToast({title: 'Business profile has been successfully deleted!', color: 'danger'})
			router.replace(uri.business_profile.lists)

			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['me'] });
			}, 0);
		}
	})

	useEffect(() => {
		let e = []
		const handleError = (errorHandler) => {
			e = Object.values(errorHandler).map(([v, k]) => (v))
			setErrors(e)
		}

		if (
			typeof errorSubmit !== undefined &&
			typeof errorSubmit?.response?.data?.errors === 'undefined' &&
			typeof errorSubmit?.response?.data?.message !== 'undefined' &&
			typeof errorSubmit?.response?.data?.error_code !== 'undefined'
		) {
			setErrors(errorSubmit?.response?.data?.message)
		}

		if (
			typeof errorSubmit !== undefined &&
			typeof errorSubmit?.response?.data?.errors !== 'undefined' &&
			errorSubmit?.response?.data?.errors &&
			Object.keys(errorSubmit?.response?.data?.errors).length > 0
		) {
			handleError(errorSubmit?.response?.data?.errors)
		}

		if (
			typeof errorUpdate !== undefined &&
			errorUpdate?.response?.data?.errors &&
			Object.keys(errorUpdate?.response?.data?.errors).length > 0
		) {
			handleError(errorUpdate?.response?.data?.errors)
		}
	}, [errorSubmit, errorUpdate]);

	useEffect(() => {
		if (hasToast && hasToast.title !== '') {
			addToast({
				title: hasToast.title,
				description: hasToast.message ?? null,
				color: hasToast.color
			});
		}
	}, [hasToast])

	const value = {
		handleClick,
		handleFileChange,
		preview,
		inputRef,
		paymentMethods,
		handleFormChange,
		handlePaymentMethodsChange,
		businessProfileForm,
		paymentInfoForm,
		submitForm,
		businessProfileData,
		businessProfilePage,
		setBusinessProfilePage,
		save,
		mode,
		setSearch,
		handleSearchKeyDown,
		errors,
		isOpenConfirmDeleteModal,
		onOpenConfirmDeleteModal,
		onOpenChangeConfirmDeleteModal,
		deleteBusinessProfile,
		isError,
		isLoading,
		isRedirectingAfterCreateOrSave,
	}
	return <BusinessProfileContext.Provider value={value}>
		{children}
	</BusinessProfileContext.Provider>
}

export const useBusinessProfile = () => {
	const ctx = useContext(BusinessProfileContext)
	if (!ctx) {
		throw new Error('Cannot load BusinessProfileContext')
	}
	return ctx
}
