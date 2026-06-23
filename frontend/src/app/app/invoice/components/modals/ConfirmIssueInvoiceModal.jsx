"use client"

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {useRouter} from "next/navigation";
import {
	Check,
	FileText,
	LockKeyhole,
	RefreshCcw,
	Send,
	ShieldCheck,
	TriangleAlert,
	X,
} from "lucide-react";

const formatInvoiceNumber = (invoiceNumber, invoiceId) => {
	if (invoiceNumber) {
		const value = String(invoiceNumber);
		return value.startsWith("#") ? value : `#${value}`;
	}

	return invoiceId ? `#${invoiceId}` : "-";
};

const formatMoneyFromCents = (amountCents, currencySymbol = "$") => {
	const amount = Number(amountCents ?? 0) / 100;

	return `${currencySymbol}${amount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
};

export default function ConfirmIssueInvoiceModal({invoiceId}) {
	const {
		data,
		selectedCurrency,
		isOpenConfirmIssueInvoice,
		onOpenChangeConfirmIssueInvoice,
		save,
		updateIsPending
	} = useInvoice()
	const router = useRouter()

	const invoiceNumber = formatInvoiceNumber(data?.invoice_number, invoiceId);
	const totalAmount = formatMoneyFromCents(
		data?.total_cents,
		selectedCurrency?.symbol ?? data?.currency?.symbol ?? "$"
	);

	return (
		<>
			<Modal
				isOpen={isOpenConfirmIssueInvoice}
				onOpenChange={onOpenChangeConfirmIssueInvoice}
				hideCloseButton
				placement="center"
				size="xl"
				classNames={{
					backdrop: "z-[9998] bg-[#111827]/40 backdrop-blur-[2px]",
					wrapper: "z-[9999] p-4",
					base: "z-[10000] max-w-[640px] overflow-hidden rounded-[24px] bg-white shadow-[0_28px_80px_-28px_rgba(15,23,42,0.55)]",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex !px-[12px] !py-[12px] justify-between items-center border-b border-[#edf0f5] sm:px-8">
								<div className="flex items-center gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#fff4cc] text-[#f5a524]">
										<FileText aria-hidden="true" className="size-6" strokeWidth={2.2}/>
									</div>
									<h2 className="text-[22px] font-bold leading-tight tracking-normal text-[#111827] sm:text-[24px]">
										Issue Invoice
									</h2>
								</div>
								<button
									type="button"
									onClick={onClose}
									aria-label="Close issue invoice confirmation"
									className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#98a2b3] transition-colors hover:bg-[#f4f6f8] hover:text-[#667085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a524] focus-visible:ring-offset-2"
								>
									<X aria-hidden="true" className="size-5" strokeWidth={2.5}/>
								</button>
							</ModalHeader>

							<ModalBody className="px-6 pb-0 pt-8 sm:px-8">
								<div className="flex flex-col items-center text-center">
									<div className="mb-6 flex size-20 items-center justify-center rounded-[22px] bg-[#fff3c8] text-[#f5a524] shadow-[0_18px_36px_-30px_rgba(245,165,36,0.85)]">
										<TriangleAlert aria-hidden="true" className="size-10 fill-current text-[#f5a524] stroke-white" strokeWidth={2.4}/>
									</div>
									<strong className="max-w-[430px] text-[23px] font-bold leading-[1.2] tracking-normal text-[#111827] sm:text-[26px]">
										Are you sure you want to issue this invoice?
									</strong>
									<p className="mt-4 max-w-[500px] text-[15px] font-normal leading-[1.55] tracking-normal text-[#697386] sm:text-[17px]">
										Once issued, this invoice will be finalized and its main fields can no longer be edited. The invoice status will change to Issued, and you can then send it to the client, email yourself a copy, or download it manually.
									</p>
								</div>

								<div className="mt-8 rounded-[16px] border border-[#eef1f6] bg-[#fafbfe] px-5 py-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)] sm:px-6">
									<h3 className="text-[14px] font-bold uppercase leading-none tracking-normal text-[#637083] sm:text-[15px]">
										What Happens Next
									</h3>
									<div className="mt-5 flex flex-col gap-4">
										<div className="flex items-center gap-4 text-left text-[15px] leading-snug text-[#344054] sm:text-[16px]">
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff4cc] text-[#f5a524]">
												<LockKeyhole aria-hidden="true" className="size-4" strokeWidth={2.6}/>
											</span>
											<span>All invoice fields will be permanently locked</span>
										</div>
										<div className="flex items-center gap-4 text-left text-[15px] leading-snug text-[#344054] sm:text-[16px]">
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff4cc] text-[#f5a524]">
												<Send aria-hidden="true" className="size-4 fill-current" strokeWidth={2.2}/>
											</span>
											<span>The invoice will be ready to send to the client’s email address.</span>
										</div>
										<div className="flex items-center gap-4 text-left text-[15px] leading-snug text-[#344054] sm:text-[16px]">
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff4cc] text-[#f5a524]">
												<RefreshCcw aria-hidden="true" className="size-4" strokeWidth={2.6}/>
											</span>
											<span>The invoice status will change to Issued.</span>
										</div>
									</div>
								</div>

								<div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-[16px] border border-[#dde2ea] bg-white px-5 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:px-6">
									<div className="flex min-w-0 items-center gap-4">
										<FileText aria-hidden="true" className="size-5 shrink-0 text-[#7b8794]" strokeWidth={2.4}/>
										<div className="min-w-0 text-left">
											<div className="text-[15px] font-semibold leading-tight tracking-normal text-[#98a2b3] sm:text-[16px]">Invoice</div>
											<div className="truncate text-[20px] font-bold leading-tight tracking-normal text-[#111827] sm:text-[22px]">{invoiceNumber}</div>
										</div>
									</div>
									<div className="shrink-0 text-left sm:text-right">
										<div className="text-[15px] font-semibold leading-tight tracking-normal text-[#98a2b3] sm:text-[16px]">Total Amount</div>
										<div className="text-[20px] font-bold leading-tight tracking-normal text-[#111827] sm:text-[22px]">{totalAmount}</div>
									</div>
								</div>
							</ModalBody>

							<ModalFooter className="flex flex-col gap-5 px-6 pb-7 pt-7 sm:px-8">
								<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
									<Button
										variant="bordered"
										onPress={onClose}
										className="h-12 rounded-[14px] border-[#d9dee7] bg-white text-[16px] font-bold tracking-normal text-[#344054] shadow-none sm:h-14"
									>
										Cancel
									</Button>
									<Button
										isDisabled={updateIsPending}
										isLoading={updateIsPending}
										onPress={() => save('issue', () => {
											onClose();
											router.replace(`/app/invoice/${invoiceId}/send`)
										}).catch(() => {})}
										className="h-12 rounded-[14px] bg-[#f5a524] text-[16px] font-bold tracking-normal text-white shadow-[0_18px_36px_-26px_rgba(245,165,36,0.95)] sm:h-14"
									>
										<Check aria-hidden="true" className="size-5" strokeWidth={3}/>
										{updateIsPending ? 'Issuing Invoice...' : 'Confirm & Issue'}
									</Button>
								</div>
								<div className="flex w-full items-center justify-center gap-3 text-center text-[14px] font-medium leading-snug tracking-normal text-[#98a2b3]">
									<ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-[#98a2b3]" strokeWidth={2.3}/>
									<span>This action is irreversible and will be logged for compliance</span>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
