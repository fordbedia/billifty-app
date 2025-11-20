"use client"

import {createContext, useContext, useState} from "react";
import {Exception} from "sass";
import {useQuery} from "@tanstack/react-query";
import Clients from "@/app/models/Clients";
import {usePathname} from "next/navigation";
import {uri} from "@/app/app/constants/routePaths";

export const ClientContext = createContext(null)

export function ClientProvider({ children, mode }) {
	const pathname = usePathname()
	const [clientPage, setClientPage] = useState(1)
	console.log('pathname', pathname)
	const {data: clients} = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			return (await Clients.allWithPaginate())?.data
		},
		enabled: pathname === '/app/invoice/client',
		retry: false
	})

	const value = {
		mode,
		clients,
		clientPage,
		setClientPage,
		uri
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