"use client"

import Layout from "@/app/app/invoice/Layout";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";

export default function NewInvoice() {

	return (
		<InvoiceProvider mode="new">
			<Layout />
		</InvoiceProvider>
	)
}