"use client"

import {use} from "react";
import ClientApp from "@/app/app/invoice/client/Layout";
import {ClientProvider} from "@/app/providers/ClientProvider";

export default function ClientForm({ params }) {
	const resolvedParams = use(params)

	return (
		<ClientProvider mode="edit" id={resolvedParams?.id}>
			<ClientApp />
		</ClientProvider>
	)
}