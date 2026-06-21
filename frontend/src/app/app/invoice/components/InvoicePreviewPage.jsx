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
	Info,
	Link2,
	Link2Off,
	LockOpen,
	Mail,
	RefreshCw,
	X,
} from "lucide-react";
import {capitalize} from "@/app/utils/strings";

export default function InvoicePreviewPage({invoiceId}) {
	const queryClient = useQueryClient();
	const iframeRef = useRef(null);
	const {
		isOpenPreviewInvoiceModal, onOpenChangePreviewInvoiceModal, generatePdf
	} = useInvoice()
	const [previewUrl, setPreviewUrl] = useState(null);
	const [linkConfirmationAction, setLinkConfirmationAction] = useState(null);

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
	const invoiceSubtitle = publicUrl?.invoice_number ? `Invoice #${publicUrl.invoice_number}` : null;
	const shareUrl = publicUrl?.link;
	const isPublicLinkRevoked = Boolean(publicUrl?.public_token_revoked_at);
	const isInvoiceDraft = Boolean(publicUrl?.invoice_status === 'draft')
	const linkConfirmationContent = linkConfirmationAction?.type === 'revoke'
		? {
			title: "Revoke invoice link?",
			message: "This invoice may have already been sent to your client. Revoking this link will disable the current public invoice page and QR code. Your client will no longer be able to open this invoice or start a new online payment from the existing link.",
			secondaryMessage: "You can restore access later if needed.",
			callout: "The token will not change. This action only disables public access. The existing link token remains stored.",
			confirmLabel: "Revoke link",
			icon: <Link2Off aria-hidden="true" size={19} strokeWidth={2.2}/>,
			accentClassName: "bg-[#f59e0b]",
			iconClassName: "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]",
			calloutClassName: "border-[#fde68a] bg-[#fffbeb] text-[#7c5a12]",
			calloutIconClassName: "text-[#d97706]",
			confirmClassName: "bg-[#f97316] text-white shadow-[inset_0_-2px_0_rgba(194,65,12,0.24)]",
			confirmIcon: <Link2Off aria-hidden="true" size={15} strokeWidth={2.4}/>,
		}
		: (linkConfirmationAction?.type === 'renew' ? (
			{
				title: "Generate new invoice link?",
				message: "Generating a new link will replace the current public invoice token. Any QR code, PDF, or email already sent with the old link may no longer work.",
				secondaryMessage: "Only continue if you plan to resend the updated invoice link to your client.",
				callout: "Previously sent links may become invalid. Share the new link with your client after generating.",
				confirmLabel: "Generate new link",
				icon: <RefreshCw aria-hidden="true" size={19} strokeWidth={2.4}/>,
				accentClassName: "bg-[#2563eb]",
				iconClassName: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
				calloutClassName: "border-[#bfdbfe] bg-[#eff6ff] text-[#1e3a8a]",
				calloutIconClassName: "text-[#2563eb]",
				confirmClassName: "bg-[#2563eb] text-white shadow-[inset_0_-2px_0_rgba(30,64,175,0.24)]",
				confirmIcon: <RefreshCw aria-hidden="true" size={15} strokeWidth={2.4}/>,
			}
		) : null);

	const copyShareUrl = async () => {
		if (typeof navigator !== "undefined" && navigator.clipboard) {
			await navigator.clipboard.writeText(shareUrl);
		}
	};

	const {mutate: revoke, isPending: revokeIsPending} = useMutation({
		mutationFn: async () => (await Invoice.revokeInvoicePublicUrl(invoiceId))?.data,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['invoice-public-url', invoiceId]});
		}
	})

	const {mutate: renew, isPending: renewIsPending} = useMutation({
		mutationFn: async (from) => (await Invoice.renewInvoicePublicUrl(invoiceId, from))?.data,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['invoice-public-url', invoiceId]});
		}
	})

	const handleLinkConfirmationOpenChange = (isOpen) => {
		if ((revokeIsPending || renewIsPending) && !isOpen) {
			return;
		}

		if (!isOpen) {
			setLinkConfirmationAction(null);
		}
	};

	const confirmLinkAction = () => {
		if (linkConfirmationAction?.type === 'revoke') {
			revoke(undefined, {
				onSuccess: () => {
					setLinkConfirmationAction(null);
				}
			});
			return;
		}

		if (linkConfirmationAction?.type === 'renew') {
			const from = linkConfirmationAction.from;

			renew(from, {
				onSuccess: () => {
					setLinkConfirmationAction(null);
				}
			});
		}
	};

	const linkActionIsPending = revokeIsPending || renewIsPending;

	const handleRenewLinkButtonPress = () => {
		if (isPublicLinkRevoked) {
			renew('revoked');
			return;
		}

		setLinkConfirmationAction({
			type: 'renew',
			from: null
		});
	};

	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Error loading invoice preview: {queryError?.message ?? "Unable to load preview."}
			</div>
		);
	}

	return (
		<>
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

									<div
										className="inline-flex h-[32px] items-center self-start rounded-full bg-[#e9f1fa] px-[17px] text-[14px] font-extrabold text-[#4797d5] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
										<span
											className={"mr-[8px] h-[8px] w-[8px] rounded-full " + (publicUrl?.invoice_status === 'paid' ? ' bg-[#56d626] ' : publicUrl?.invoice_status === 'issued' ? 'bg-[#b26ce8]' : ' bg-[#f6bb35] ')}/>
										{capitalize(publicUrl?.invoice_status)}
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
								{!isInvoiceDraft && (
									<section className="border-b border-[#e4e4e4] bg-[#f8f8f8] px-5 py-5 sm:px-7">
										<div className="mb-4 flex flex-wrap items-center gap-2.5">
											<Link2 aria-hidden="true" className="text-[#2da0e4]" size={18}
												   strokeWidth={2.4}/>
											<span
												className="text-sm font-bold uppercase leading-none tracking-normal text-[#17191d]">
										Shareable Client Invoice Link
									</span>
											<Chip
												size="sm"
												variant="flat"
												classNames={{
													base: "px-1 " + (publicUrl?.public_token_revoked_at ? 'bg-[#f6b4bb]' : 'bg-[#e8faec]'),
													content: "text-sm font-semibold leading-none tracking-normal "
														+ (publicUrl?.public_token_revoked_at ? 'text-[#cf1010]' : 'text-[#2e9b50]'),
												}}
											>
												{publicUrl?.public_token_revoked_at ? 'Not Active' : 'Active'}
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
												aria-label="Shareable Client invoice link"
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
													startContent={<Copy aria-hidden="true" size={18}
																		strokeWidth={2.2}/>}
													className="h-12 min-h-12 w-full bg-[#e9f2ff] px-3 text-sm font-semibold leading-none tracking-normal text-[#2f9bda]"
												>
													Copy
												</Button>
											)}
											<Button
												onPress={() => setLinkConfirmationAction({type: 'revoke'})}
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
											onPress={handleRenewLinkButtonPress}
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
												{isPublicLinkRevoked ? 'Activate Link' : 'New Link'}
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

			<Modal
				isOpen={Boolean(linkConfirmationAction)}
				onOpenChange={handleLinkConfirmationOpenChange}
				size="md"
				hideCloseButton
				classNames={{
					backdrop: "z-[10010] bg-[#0f172a]/30",
					wrapper: "z-[10011] items-center px-4",
					base: "z-[10012] max-w-[480px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-0 shadow-[0_22px_58px_-30px_rgba(15,23,42,0.7)]",
				}}
			>
				<ModalContent
					className="w-full max-w-[480px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-0 shadow-[0_22px_58px_-30px_rgba(15,23,42,0.7)]">
					{(onClose) => (
						<>
							<div className={`h-1 ${linkConfirmationContent.accentClassName}`}/>
							<div className="p-6 sm:p-7">
								<div className="flex items-start justify-between gap-4">
									<div className="flex min-w-0 items-start gap-3">
										<div
											className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${linkConfirmationContent.iconClassName}`}>
											{linkConfirmationContent.icon}
										</div>

										<div className="min-w-0">
											<h2 className="text-base font-semibold leading-6 tracking-normal text-[#111316]">
												{linkConfirmationContent.title}
											</h2>
											{invoiceSubtitle && (
												<p className="mt-0.5 truncate text-xs font-normal leading-5 tracking-normal text-[#64748b]">
													{invoiceSubtitle}
												</p>
											)}
										</div>
									</div>

									<Button
										type="button"
										onPress={onClose}
										aria-label="Close confirmation"
										isIconOnly
										isDisabled={linkActionIsPending}
										radius="full"
										variant="light"
										className="size-8 min-w-8 shrink-0 text-[#94a3b8] hover:text-[#111316]"
									>
										<X aria-hidden="true" size={18} strokeWidth={2.2}/>
									</Button>
								</div>

								<div className="mt-5 border-t border-[#f1f5f9] pt-5">
									<p className="text-sm font-normal leading-6 tracking-normal text-[#334155]">
										{linkConfirmationContent.message}
									</p>
									<p className="mt-4 text-sm font-normal leading-6 tracking-normal text-[#475569]">
										{linkConfirmationContent.secondaryMessage}
									</p>
								</div>

								<div
									className={`mt-5 flex gap-2.5 rounded-xl border p-3 text-xs font-normal leading-5 tracking-normal ${linkConfirmationContent.calloutClassName}`}>
									<Info aria-hidden="true"
										  className={`mt-0.5 shrink-0 ${linkConfirmationContent.calloutIconClassName}`}
										  size={14} strokeWidth={2.3}/>
									<span>{linkConfirmationContent.callout}</span>
								</div>

								<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
									<Button
										type="button"
										onPress={onClose}
										radius="lg"
										isDisabled={linkActionIsPending}
										className="h-11 min-h-11 border border-[#e2e8f0] bg-[#f8fafc] px-5 text-sm font-semibold leading-none tracking-normal text-[#334155] shadow-[inset_0_-1px_0_rgba(15,23,42,0.04)]"
									>
										Cancel
									</Button>
									<Button
										type="button"
										onPress={confirmLinkAction}
										radius="lg"
										isDisabled={linkActionIsPending}
										startContent={linkConfirmationContent.confirmIcon}
										className={`h-11 min-h-11 px-5 text-sm font-semibold leading-none tracking-normal ${linkConfirmationContent.confirmClassName}`}
									>
										{linkActionIsPending ? 'Working...' : linkConfirmationContent.confirmLabel}
									</Button>
								</div>
							</div>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
