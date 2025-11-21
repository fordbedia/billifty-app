"use client"

import ClientApp from "@/app/app/invoice/client/Layout";
import {ClientProvider} from "@/app/providers/ClientProvider";

export default function ClientForm({ params }) {
	return (
		<ClientProvider mode="edit" id={params.id}>
			<ClientApp />
		</ClientProvider>
	)
}