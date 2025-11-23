"use client"

import {use} from "react";
import Layout from "@/app/app/invoice/Layout";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";

export default function App({ params }) {
	const resolveParams = use(params)

	return (
		<InvoiceProvider initialId={resolveParams?.id} mode="edit">
			<Layout />
		</InvoiceProvider>
	)
}