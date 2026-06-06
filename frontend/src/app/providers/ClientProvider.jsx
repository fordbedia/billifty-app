"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {Exception} from "sass";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Clients from "@/app/models/Clients";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import {addToast, useDisclosure} from "@heroui/react";

export const ClientContext = createContext(null)

const clientFormFields = new Set([
	'name',
	'company',
	'email',
	'phone',
	'tax_id',
	'license_no',
	'address_line1',
	'address_line2',
	'city',
	'state',
	'postal_code',
	'country',
]);

export function ClientProvider({ children, mode, id }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const queryClient = useQueryClient()
	const initialState = {
		name: '',
		company: '',
		email: '',
		phone: '',
		tax_id: '',
		license_no: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
	}
	const initialToast = {
		title: '',
		message: '',
		color: '',
	}
	const {isOpen:confirmDeleteModalIsOpen, onOpen: confirmDeleteModalOnOpen, onOpenChange: confirmDeleteModalOnOpenChange} = useDisclosure();

	const [data, setData] = useState({...initialState})
	const [search, setSearch] = useState(null)
	const [appliedSearch, setAppliedSearch] = useState("");
	const pathname = usePathname()
	const [clientPage, setClientPage] = useState(1)
	const [errors, setErrors] = useState(null)
	const [hasToast, setHasToast] = useState(initialToast)

	const hasSearch = appliedSearch.trim()
	const handleSearchKeyDown = (e) => {
		if (e.key === "Enter") {
			setAppliedSearch(search);
			setClientPage(1);
		}
	}

	const {data: clients} = useQuery({
		queryKey: ['clients', clientPage, hasSearch ? appliedSearch.trim() : null],
		queryFn: async () => {
			const params = {
					page: clientPage
			}
			if (hasSearch) {
				params.search = appliedSearch.trim()
			}
			return (await Clients.allWithPaginate(params))?.data
		},
		enabled: pathname === '/app/invoice/client',
		retry: false
	})

	const {isLoading: clientDataIsLoading, data: clientData, isError: isClientDataError} = useQuery({
		queryKey: ['client', id],
		retry: false,
		enabled: !!id,
		queryFn: async () => (await Clients.find(id))?.data
	})
	const handleFieldChange = (attr, value) => setData((prev) => ({...prev, [attr]: value}))
	const clientPayload = () => Object.fromEntries(
		Object.entries(data).filter(([key]) => clientFormFields.has(key))
	)

	const {mutate: create, error: createError} = useMutation({
		// Ownership is server-assigned through workspace_id; only submit editable client fields.
		mutationFn: async () => (await Clients.create(clientPayload()))?.data,
		onSuccess: () => {
			setHasToast({title: 'New client has been successfully created!', color: 'success'})
			if (searchParams.get('from') === 'onboarding') {
				router.replace(uri.onboarding)
			} else {
				router.replace(`${uri.client.clients}?refreshMe=1`)
			}
		}
	})

	const {mutate: updateClient, error: errorUpdateClient} = useMutation({
		// Ownership is server-assigned through workspace_id; only submit editable client fields.
		mutationFn: async () => (await Clients.update(id, clientPayload())),
		onSuccess: () => {
			setHasToast({title: 'Your client has been successfully modified!', color: 'success'})
			router.replace(uri.client.clients)
		}
	})

	const {mutate: archiveClient} = useMutation({
		mutationFn: async () => (await Clients.delete(id))?.data,
		onSuccess: () => {
			setHasToast({title: 'You successfully deleted a client!', color: 'danger'})
			router.replace(uri.client.clients)

			queryClient.invalidateQueries({ queryKey: ["me"] });
		}
	})

	const save = () => {
		switch(mode) {
			case 'new':
				create()
				break;
			case 'edit':
				updateClient()
				break;
		}
	}

	useEffect(() => {
    if (searchParams.get("refreshMe") === "1") {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      router.replace(uri.client.clients);
    }
  }, [searchParams, queryClient, router]);

	useEffect(() => {
		let e = [];
		const handleError = (error) => {
			let errorArr = error?.response?.data?.errors;
			return errorArr ? Object.entries(errorArr).map(([v, k]) => k[0]) : []
		}

		if (
			typeof createError !== undefined &&
			typeof createError?.response?.data?.errors === 'undefined' &&
			typeof createError?.response?.data?.message !== 'undefined' &&
			typeof createError?.response?.data?.error_code !== 'undefined'
		) {
			e = createError?.response?.data?.message
		}

		if (typeof createError !== 'undefined' &&
			createError &&
			Object.keys(createError).length > 0 &&
			typeof createError?.response?.data?.error_code === 'undefined'
		) {
			e = handleError(createError)
		}

		if (typeof errorUpdateClient !== 'undefined' &&
			errorUpdateClient &&
			Object.keys(errorUpdateClient).length > 0
		) {
			e = handleError(errorUpdateClient)
		}
		setErrors(e)
	}, [createError, errorUpdateClient]);

	useEffect(() => {
		if (typeof clientData !== 'undefined' && clientData && Object.keys(clientData).length > 0) {
			setData(clientData)
		}
	}, [clientData])

	useEffect(() => {
		if (typeof hasToast !== 'undefined' && hasToast.title !== '') {
			addToast({
				title: hasToast.title,
				description: hasToast.message ?? null,
				// @ts-ignore
				variant: 'flat',
				color: hasToast.color ?? 'primary',
				timeout: 4000
			})
		}
	}, [hasToast]);

	const value = {
		mode,
		clients,
		clientPage,
		setClientPage,
		uri,
		handleFieldChange,
		data,
		save,
		errors,
		isClientDataError,
		clientDataIsLoading,
		confirmDeleteModalIsOpen,
		confirmDeleteModalOnOpen,
		confirmDeleteModalOnOpenChange,
		archiveClient,
		setHasToast,
		handleSearchKeyDown,
		setSearch,
	}

	return <ClientContext.Provider value={value}>
		{children}
	</ClientContext.Provider>
}

export const useClient = () => {
	const ctx = useContext(ClientContext)
	if (!ctx) {
		throw new Exception('Cannot load ClientContext')
	}
	return ctx
}
