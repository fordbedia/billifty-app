"use client";

import {useEffect, useRef, useState} from "react";
import Invoice from "@/app/models/Invoices";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Chip, Input, Modal, ModalBody, ModalContent, ModalHeader, Switch} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {
	Ban,
	Copy,
	Download,
	FileText,
	Link2,
	LockOpen,
	Mail,
	RefreshCw,
	X,
} from "lucide-react";

export default function InvoicePreviewPage({invoiceId}) {
	const queryClient = useQueryClient();
	const iframeRef = useRef(null);
	const {
		isOpenPreviewInvoiceModal, onOpenChangePreviewInvoiceModal, generatePdf
	} = useInvoice()
	const [previewUrl, setPreviewUrl] = useState(null);

	const {
		data: html,
		isSuccess,
		isError,
		error: queryError,
	} = useQuery({
		queryKey: ['preview-invoice', invoiceId],
		queryFn: async () => (await Invoice.preview(invoiceId))?.data,
		enabled: !!invoiceId,
		retry: false
	})

	const {
		data: publicUrl,
	} = useQuery({
		queryKey: ['invoice-public-url', invoiceId],
		queryFn: async () => (await Invoice.getInvoicePublicUrl(invoiceId))?.data,
		enabled: !!invoiceId,
		retry: false
	})

	useEffect(() => {
		if (isOpenPreviewInvoiceModal && invoiceId) {
			queryClient.invalidateQueries({queryKey: ['preview-invoice', invoiceId]});
			queryClient.invalidateQueries({queryKey: ['invoice-public-url', invoiceId]});
		}
	}, [isOpenPreviewInvoiceModal]);

	const injectIframeStyles = () => {
		const iframe = iframeRef.current;

		if (!iframe) return;

		const doc = iframe.contentDocument || iframe.contentWindow?.document;

		if (!doc) return;

		const style = doc.createElement("style");

		style.innerHTML = `
        .invoice-page {
            width: auto !important;
            max-width: 100% !important;
			}
		`;

		doc.head.appendChild(style);
	};

	const invoiceNumber = invoiceId ? `${publicUrl?.invoice_number}` : "-";
	const shareUrl = publicUrl?.link;
	const isPublicLinkRevoked = Boolean(publicUrl?.public_token_revoked_at);
	const isInvoiceDraft = Boolean(publicUrl?.invoice_status === 'draft')

	const copyShareUrl = async () => {
		if (typeof navigator !== "undefined" && navigator.clipboard) {
			await navigator.clipboard.writeText(shareUrl);
		}
	};

	const {mutate: revoke} = useMutation({
		mutationFn: async () => (await Invoice.revokeInvoicePublicUrl(invoiceId))?.data,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['invoice-public-url', invoiceId]});
		}
	})

	const {mutate: renew, isPending: renewIsPending} = useMutation({
		mutationFn: async () => (await Invoice.renewInvoicePublicUrl(invoiceId))?.data,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['invoice-public-url', invoiceId]});
		}
	})

	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Error loading invoice preview: {queryError?.message ?? "Unable to load preview."}
			</div>
		);
	}

	return (
		<Modal
			isOpen={isOpenPreviewInvoiceModal}
			onOpenChange={onOpenChangePreviewInvoiceModal}
			size="5xl"
			scrollBehavior="inside"
			hideCloseButton
			classNames={{
				backdrop: "z-[10000] bg-[#6d7373]/95",
				wrapper: "z-[10001] items-center px-3 py-4 sm:px-5",
				base: "z-[10002] my-0 max-h-[calc(100vh-32px)] w-full max-w-[920px] overflow-hidden rounded-[20px] bg-white p-0 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)]",
			}}
		>
			<ModalContent className="w-full max-w-[920px] overflow-hidden rounded-[20px] bg-white p-0">
				{(onClose) => (
					<>
						<ModalHeader
							className="flex min-h-[70px] items-center justify-between border-b border-[#e4e4e4] !px-[15px]">
							<div className="flex min-w-0 items-center gap-4">
								<div
									className="flex size-9 shrink-0 items-center justify-center rounded-[16px] bg-[#e8f3ff] text-[#2da0e4]">
									<FileText aria-hidden="true" size={21} strokeWidth={2.25}/>
								</div>
								<div className="min-w-0">
									<h2 className="truncate text-[22px] font-semibold leading-none tracking-normal text-[#111316]">
										Invoice Preview
									</h2>
									<p className="mt-2 truncate text-base font-normal leading-none tracking-normal text-[#2b99dd]">
										{invoiceNumber}
									</p>
								</div>
							</div>
							<Button
								type="button"
								onPress={onClose}
								aria-label="Close invoice preview"
								isIconOnly
								radius="full"
								variant="light"
								className="size-9 min-w-9 shrink-0 text-[#0e0f11]"
							>
								<X aria-hidden="true" size={22} strokeWidth={2.2}/>
							</Button>
						</ModalHeader>
						<ModalBody className="p-0">
							{console.log('isInvoiceDraft', isInvoiceDraft)}
							{!isInvoiceDraft ? (
								<section className="border-b border-[#e4e4e4] bg-[#f8f8f8] px-5 py-5 sm:px-7">
									<div className="mb-4 flex flex-wrap items-center gap-2.5">
										<Link2 aria-hidden="true" className="text-[#2da0e4]" size={18}
											   strokeWidth={2.4}/>
										<span
											className="text-sm font-bold uppercase leading-none tracking-normal text-[#17191d]">
										Shareable Link
									</span>
										<Chip
											size="sm"
											variant="flat"
											classNames={{
												base: "bg-[#e8faec] px-1",
												content: "text-sm font-semibold leading-none tracking-normal text-[#2e9b50]",
											}}
										>
											Active
										</Chip>
									</div>

									<div
										className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_96px_116px_132px]">
										<Input
											style={{
												WebkitUserSelect: "none",
												MozUserSelect: "none",
												msUserSelect: "none",
												userSelect: "none",
											}}
											isDisabled={isPublicLinkRevoked}
											aria-label="Shareable invoice link"
											value={shareUrl ?? ""}
											isReadOnly
											variant="bordered"
											radius="lg"
											startContent={<LockOpen aria-hidden="true"
																	className="shrink-0 text-[#2da0e4]"
																	size={19} strokeWidth={2.4}/>}
											classNames={{
												base: "min-w-0",
												inputWrapper: "min-h-[48px] border-[#dedede] bg-white px-4 shadow-none group-data-[focus=true]:border-[#2b99dd] data-[disabled=true]:opacity-100",
												input: `truncate text-sm font-normal leading-none tracking-normal text-[#111316] ${
													isPublicLinkRevoked ? "pointer-events-none select-none blur-[3px] [user-select:none]" : ""
												}`,
											}}
										/>
										{!isPublicLinkRevoked && (
											<Button
												disabled={publicUrl?.public_token_revoked_at}
												type="button"
												onPress={copyShareUrl}
												radius="lg"
												startContent={<Copy aria-hidden="true" size={18} strokeWidth={2.2}/>}
												className="h-12 min-h-12 w-full bg-[#e9f2ff] px-3 text-sm font-semibold leading-none tracking-normal text-[#2f9bda]"
											>
												Copy
											</Button>
										)}
										<Button
											onPress={() => revoke()}
											disabled={isPublicLinkRevoked}
											type="button"
											radius="lg"
											startContent={<Ban aria-hidden="true" size={18} strokeWidth={2.3}/>}
											className={`h-12 min-h-12 w-full px-3 text-sm font-semibold leading-none tracking-normal ${
												isPublicLinkRevoked ? "bg-[#dc293c] text-white" : "bg-[#e8e8ea] text-[#111316]"
											}`}
										>
											{isPublicLinkRevoked ? 'Revoked' : 'Revoke'}
										</Button>
										<Button
											onPress={renew}
											type="button"
											radius="lg"
											startContent={
												<RefreshCw
													aria-hidden="true"
													className={`transition-transform duration-300 group-hover:rotate-180 ${
														renewIsPending ? "animate-spin" : ""
													}`}
													size={18}
													strokeWidth={2.5}
												/>
											}
											className="group h-12 min-h-12 w-full bg-[#e8e8ea] px-3 text-sm font-semibold leading-none tracking-normal text-[#111316]"
										>
											{isPublicLinkRevoked ? 'Activate' : 'New Link'}
										</Button>
									</div>

									<div
										className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
										<div className="flex flex-wrap items-center gap-3">
											<Button
												type="button"
												onPress={generatePdf}
												radius="lg"
												startContent={<Download aria-hidden="true" size={19}
																		strokeWidth={2.5}/>}
												className="min-h-[48px] bg-[#20a5eb] px-5 text-sm font-bold leading-none tracking-normal text-white shadow-[inset_0_-3px_0_rgba(16,127,190,0.28)]"
											>
												Download PDF
											</Button>
											{/*<Button*/}
											{/*	type="button"*/}
											{/*	radius="lg"*/}
											{/*	variant="bordered"*/}
											{/*	startContent={<Mail aria-hidden="true" size={19} strokeWidth={2.2}/>}*/}
											{/*	className="min-h-[48px] border-[#dedede] bg-white px-5 text-sm font-semibold leading-none tracking-normal text-[#111316]"*/}
											{/*>*/}
											{/*	Send Email*/}
											{/*</Button>*/}
										</div>
										{/*<Switch*/}
										{/*	size="sm"*/}
										{/*	color="primary"*/}
										{/*	classNames={{*/}
										{/*		base: "items-center gap-3",*/}
										{/*		label: "text-sm font-normal leading-none tracking-normal text-[#111316]",*/}
										{/*		wrapper: "bg-[#e5e5e7] group-data-[selected=true]:bg-[#20a5eb]",*/}
										{/*	}}*/}
										{/*>*/}
										{/*	Notify client by email when link changes*/}
										{/*</Switch>*/}
									</div>
								</section>
							) : (
								<section className="border-b border-[#e4e4e4] bg-[#f8f8f8] px-5 py-5 sm:px-7">
									<div className="mb-4 flex flex-wrap items-center gap-2.5">
										<div className="text-red-600">This invoice has not been issued yet.</div>
									</div>
								</section>
							)}

							<section className="bg-[#f7fbff] px-4 pb-6 pt-7 sm:px-6 lg:px-12">
								<div
									className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[16px] border border-[#dce6ef] bg-white shadow-[0_20px_62px_-42px_rgba(34,80,116,0.45)]">
									<iframe
										ref={iframeRef}
										srcDoc={html ?? ""}
										onLoad={injectIframeStyles}
										title="Invoice HTML preview"
										className="block h-[520px] min-h-[55vh] w-full border-0 bg-white"
									/>
								</div>
							</section>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
