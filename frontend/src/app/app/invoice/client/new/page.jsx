"use client"

import ClientApp from "@/app/app/invoice/client/Layout";
import {ClientProvider} from "@/app/providers/ClientProvider";

export default function ClientForm() {
	return (
		<ClientProvider mode="new">
			<ClientApp />
		</ClientProvider>
	)
}