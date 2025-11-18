"use client";

import {createContext, useContext, useRef, useState} from "react";
import {Exception} from "sass";
import {useMutation, useQuery} from "@tanstack/react-query";
import BusinessProfile from "@/app/models/BusinessProfile";
import { useRouter, useSearchParams, useParams, usePathname } from "next/navigation";

export const BusinessProfileContext = createContext()

export function BusinessProfileProvider({ children }) {
	const router = useRouter()

	const paymentInfoInitialState = {
		user_id: '',
		payment_method: '',
		bank_name: '',
		account_name: '',
		account_number: '',
		routing_number: '',
		iban: '',
		swift_code: '',
		paypal_email: '',
		cash_app: '',
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

	const [businessProfileForm, setBusinessProfileForm] = useState({...businessProfileInitialState})
	const [paymentInfoForm, setPaymentInfoForm] = useState({...paymentInfoInitialState})

	const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

	const {data: businessProfileData} = useQuery({
		queryKey: ['business-profiles'],
		queryFn: async () => (await BusinessProfile.paginate())?.data,
		retry: false,
		keepPreviousData: true,
	})
	const [businessProfilePage, setBusinessProfilePage] = useState(1)

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

	const {mutate: submitForm} = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			// Business Profile
			Object.entries(businessProfileForm).forEach(([key, val]) => {
				if (val !== undefined && val !== null) {
					formData.append(key, val)
				}
			})
			// Payment Info
			Object.entries(paymentInfoForm).forEach(([key, val]) => {
				if (val !== undefined && val !== null) {
					formData.append(`paymentInfo[${key}]`, val);
				}
			})

			return await BusinessProfile.create(formData)
		},
		onSuccess: () => {
			window.location.href = '/app/invoice/business-profile'
		}
	})

	const value = {
		handleClick,
		handleFileChange,
		preview,
		inputRef,
		paymentMethods,
		handleFormChange,
		businessProfileForm,
		paymentInfoForm,
		submitForm,
		businessProfileData,
		businessProfilePage,
		setBusinessProfilePage,
	}
	return <BusinessProfileContext.Provider value={value}>
		{children}
	</BusinessProfileContext.Provider>
}

export const useBusinessProfile = () => {
	const ctx = useContext(BusinessProfileContext)
	if (!ctx) {
		throw new Exception('Cannot load BusinessProfileContext')
	}
	return ctx
}