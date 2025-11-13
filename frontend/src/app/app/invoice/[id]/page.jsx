"use client"

import Layout from "@/app/app/invoice/Layout";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";

export default function App({ params }) {

	return (
		<InvoiceProvider initialId={params.id} mode="edit">
			<Layout />
		</InvoiceProvider>
	)
}