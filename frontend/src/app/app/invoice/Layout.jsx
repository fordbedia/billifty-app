"use client";

import RootLayout from "@/app/components/common/RootLayout";
import {Button, Card, CardHeader, CardBody, CardFooter, Divider} from "@heroui/react";
import {Reorder} from "framer-motion";
import InvoiceItem from "@/app/app/invoice/components/InvoiceItem";
import AddMoreItems from "@/app/app/invoice/components/buttons/AddMoreItems";
import InvoiceInfo from "@/app/app/invoice/components/InvoiceInfo";
import InvoiceTemplate from "@/app/app/invoice/components/InvoiceTemplate";
import {useInvoice} from "@/app/providers/InvoiceContext";
import Actions from "@/app/app/invoice/components/buttons/Actions";
import ConfirmIssueInvoiceModal from "@/app/app/invoice/components/modals/ConfirmIssueInvoiceModal";
import ConfirmNewInvoice from "@/app/app/invoice/components/modals/ConfirmNewInvoice";
import NotFound from "@/app/app/invoice/components/errorPages/NotFound";
import BSpinner from "@/app/components/Spinner";
import ConfirmDeleteModal from "@/app/app/invoice/components/modals/ConfirmDeleteModal";
import InvoicePreviewPage from "@/app/app/invoice/components/InvoicePreviewPage";
import ChatWidget from "@/app/components/common/ChatWidget";
import {useApp} from "@/app/providers/AppContext";

const workspacePrimaryButtonClass =
	"group h-auto min-h-[42px] rounded-full bg-[#2299dc] px-5 py-2 text-sm font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1684c5] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

const statusBadgeClassMap = {
	draft: "border-[#f7d47b] bg-[#fff4cf] text-[#8a5a00]",
	issued: "border-[#b8cdfa] bg-[#eaf2ff] text-[#0b5ecb]",
	paid: "border-[#a7e6c6] bg-[#e8fbf1] text-[#087a3d]",
};

const formatStatusLabel = (status) => {
	if (!status) return "Draft";

	return String(status)
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function Layout({showAiAssistant = false}) {
	const {
		data,
		addItems,
		updateItems,
		reorderItems,
		removeItem,
		selectedCurrency,
		invoiceComputed,
		clearSticky,
		router,
		isInvoiceError,
		isLoadingInvoice,
		invoiceId,
	} = useInvoice();
	const {planCapabilities} = useApp();
	const aiAssistantCapability =
		planCapabilities?.allowed?.ai_invoice_assistant ??
		planCapabilities?.features?.ai_invoice_assistant ??
		planCapabilities?.ai_invoice_assistant ??
		false;
	const canUseAiAssistant = Boolean(showAiAssistant) && Boolean(aiAssistantCapability);

	const currencySymbol = selectedCurrency?.symbol ?? "";

	// ----------------------------------------------------------------------------
	// invoiceComputed is derived from the local line-item form state. During edit-page
	// hydration, the invoice header/totals can be available before invoice_items are
	// populated; computing from an empty item list would produce 0 totals and hide valid
	// DB values. Only trust computed totals after at least one local item is present.
	// ----------------------------------------------------------------------------
	const hasComputedItems = (invoiceComputed?.invoice_items?.length ?? 0) > 0;

	// ----------------------------------------------------------------------------
	// Use live computed totals while editing items; otherwise use server/DB totals.
	// This keeps the UI responsive after item edits without showing temporary 0 values
	// while the existing invoice data is still hydrating.
	// ----------------------------------------------------------------------------
	const subtotalCents =
		hasComputedItems ? invoiceComputed?.subtotal_cents ?? 0 : data.subtotal_cents ?? 0;
	const taxCents =
		hasComputedItems ? invoiceComputed?.tax_cents ?? 0 : data.tax_cents ?? 0;
	const shippingTaxCents =
		hasComputedItems ? invoiceComputed?.shipping_tax_cents ?? 0 : data.shipping_tax_cents ?? 0;
	const totalCents =
		hasComputedItems ? invoiceComputed?.total_cents ?? 0 : data.total_cents ?? 0;
	const discountRow =
		hasComputedItems ? invoiceComputed?.display_discount_row ?? null : data.display_discount_row ?? null;

	if (typeof isLoadingInvoice !== undefined && isLoadingInvoice) {
		return (
			<BSpinner/>
		)
	}

	if (typeof isInvoiceError !== 'undefined' && isInvoiceError) {
		return (
			<RootLayout>
				<NotFound/>
			</RootLayout>
		)
	}

	const isIssuedOrPaid = data?.is_issued || data?.is_paid;
	const isPaid = data?.is_paid;
	const invoiceStatus = String(data?.status || (isPaid ? "paid" : data?.is_issued ? "issued" : "draft")).toLowerCase();
	const invoiceStatusBadgeClass = statusBadgeClassMap[invoiceStatus] ?? "border-[#d2d8e2] bg-[#eef1f5] text-[#3d4655]";

	return (
		<RootLayout>
			<div className="app app-wrapper min-h-screen bg-white invoice-page">
				<ConfirmDeleteModal/>
				<ConfirmIssueInvoiceModal invoiceId={data?.id} />
				<ConfirmNewInvoice/>
				<InvoicePreviewPage invoiceId={invoiceId}/>
				<div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-10 sm:pt-12 lg:pt-16">
					<div
						className="mb-8 grid w-full grid-cols-1 gap-5 invoice-page-head 2xl:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_360px]">
						<div className="flex w-full flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
							<div className="max-w-[680px]">
								<p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
									Invoice Studio
								</p>
								<div className="mt-3 flex flex-wrap items-center gap-3">
									<h1 className="text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[54px]">
										Invoice Portal
									</h1>
									<span className={`invoice-status-badge ${invoiceStatusBadgeClass}`}>
										{formatStatusLabel(invoiceStatus)}
									</span>
								</div>
								<h2 className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">
									Create and customize your invoice with a premium, minimal workflow.
								</h2>
							</div>
							<div className="flex shrink-0 justify-start sm:pt-7">
								<Button variant="flat" className={workspacePrimaryButtonClass} onPress={() => {
									clearSticky()
									router.replace('/app/invoice/new')
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
										 strokeWidth={1.5} stroke="currentColor"
										 className="size-4 transition-transform duration-300 group-hover:rotate-90">
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
									</svg>
									New Invoice
								</Button>
							</div>
						</div>
						<div className="hidden xl:block" aria-hidden="true"></div>
					</div>

					<div
						className="grid w-full grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_360px]">
						<div className="w-full min-w-0">
							<InvoiceInfo isPaid={isPaid} isIssuedOrPaid={isIssuedOrPaid}/>
							<Card fullWidth radius="sm"
								  className="workspace-card invoice-line-items-card border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
								<CardHeader className="flex gap-3 px-5 py-5 sm:px-6">
									<div className="flex w-full justify-between items-center">
										<div>
											<p className="text-sm font-semibold uppercase tracking-normal text-[#738496]">
												Line items
											</p>
											<h2 className="mt-1 text-xl font-semibold text-[#24323f]">
												Invoice Items
											</h2>
										</div>
										<Button
											isDisabled={isIssuedOrPaid}
											onPress={addItems}
											disableRipple
											radius="sm"
											className="group rounded-[8px] border border-[#c9ddec] bg-white px-4 py-2 text-sm font-semibold text-[#28516d] shadow-[0_10px_24px_-22px_rgba(34,74,104,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad]"
										>
											<i className="plus-icon"></i>
											Add Item
										</Button>
									</div>
								</CardHeader>
								<Divider/>
								<CardBody className="px-4 py-5 sm:px-5">
									<div className="px-1 py-1">
										{data.invoice_items?.length > 0 && (
											<Reorder.Group
												as="div"
												axis="y"
												values={data.invoice_items}
												onReorder={reorderItems}
												className="invoice-items-sortable-list"
											>
												{data.invoice_items.map((item, index) => (
													<InvoiceItem
														isPaid={isPaid}
														isIssuedOrPaid={isIssuedOrPaid}
														item={item}
														key={item.id ?? item._sortable_id ?? `invoice-item-${item.position ?? index}-${index}`}
														index={index}
														onChange={updateItems}
														removeItem={removeItem}
													/>
												))}
											</Reorder.Group>
										)}

										<AddMoreItems isIssuedOrPaid={isIssuedOrPaid} link={addItems}/>
									</div>
								</CardBody>
								<Divider/>
								<CardFooter className="bg-[#f8fbfe] px-5 py-5 sm:px-6">
									<section className="invoice-summary">
										<div className="summary-row">
											<span className="label">Subtotal (before tax):</span>
											<span className="value">
                        {currencySymbol}
												{(subtotalCents / 100).toFixed(2)}
                      </span>
										</div>

										{data.shipping_cents > 0 && (
											<div className="summary-row">
												<span className="label">Shipping:</span>
												<span className="value">
                          {currencySymbol}
													{(data.shipping_cents / 100).toFixed(2)}
                        </span>
											</div>
										)}

										{shippingTaxCents > 0 && (
											<div className="summary-row">
												<span className="label">Shipping Tax:</span>
												<span className="value">
                          {currencySymbol}
													{(shippingTaxCents / 100).toFixed(2)}
                        </span>
											</div>
										)}

										{discountRow && (
											<div className="summary-row">
												<span className="label">{discountRow.label}:</span>
												<span className="value">
                          {currencySymbol}
													{(Math.abs(discountRow.amount_cents) / 100).toFixed(2)}
                        </span>
											</div>
										)}

										<div className="summary-row">
											<span className="label">Tax (items):</span>
											<span className="value">
                        {currencySymbol}
												{(taxCents / 100).toFixed(2)}
                      </span>
										</div>

										<hr className="divider"/>

										<div className="summary-row total">
											<span className="label">Total:</span>
											<span className="value accent">
                        {currencySymbol}
												{(totalCents / 100).toFixed(2)}
                      </span>
										</div>
									</section>
								</CardFooter>
							</Card>
						</div>

						<div className="invoice-sidebar w-full min-w-0">
							<InvoiceTemplate isIssuedOrPaid={isIssuedOrPaid} />
							<Actions isPaid={isPaid} isIssuedOrPaid={isIssuedOrPaid} />
						</div>
					</div>
				</div>
			</div>
			{canUseAiAssistant ? <ChatWidget/> : null}
		</RootLayout>
	);
}
