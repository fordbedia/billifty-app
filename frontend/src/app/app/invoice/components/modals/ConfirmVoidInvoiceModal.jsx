"use client"

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {Ban, FileText, TriangleAlert, X} from "lucide-react";

export default function ConfirmVoidInvoiceModal() {
	const {
		isOpenConfirmVoidInvoiceModal, onOpenChangeConfirmVoidInvoiceModal,
		data,
		voidInvoice, voidError, voidIsPending
	} = useInvoice()
	const router = useRouter()
	const [isRedirecting, setIsRedirecting] = useState(false);
	const isVoiding = voidIsPending || isRedirecting;
	const invoiceNumber = data?.invoice_number
		? `#${String(data.invoice_number).replace(/^#/, "")}`
		: data?.id
			? `#${data.id}`
			: "";

	const handleVoidInvoice = () => {
		voidInvoice(data.id).then(() => {
			setIsRedirecting(true);
			router.replace(uri.invoices);
		}).catch(() => {
			setIsRedirecting(false);
		})
	}

	return (
		<>
			<Modal
				hideCloseButton
				isOpen={isOpenConfirmVoidInvoiceModal}
				onOpenChange={onOpenChangeConfirmVoidInvoiceModal}
				placement="center"
				size="md"
				classNames={{
					backdrop: "bg-[#111827]/55 backdrop-blur-[1px]",
					wrapper: "px-4",
				}}
			>
				<ModalContent className="w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white p-0 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.65)]">
					{(onClose) => (
						<>
							<ModalHeader className="flex items-center gap-4 border-b border-[#edf0f2] !px-[12px] !py-[12px]">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#151b38] text-[#ffff]">
									<Ban aria-hidden="true" className="size-5" strokeWidth={2.4}/>
								</div>
								<div className="min-w-0 flex-1">
									<h2 className="text-[17px] font-bold leading-tight tracking-normal text-[#111827]">
										VOID Invoice
									</h2>
									<p className="mt-1 truncate text-[15px] font-bold leading-tight tracking-normal text-[#151b38]">
										{invoiceNumber}
									</p>
								</div>
								<Button
									isIconOnly
									aria-label="Close void invoice confirmation"
									className="size-9 min-w-9 shrink-0 rounded-full bg-[#f6f7f9] text-[#6b7280] shadow-none hover:bg-[#eef0f3] hover:text-[#374151]"
									isDisabled={isVoiding}
									variant="light"
									onPress={onClose}
								>
									<X aria-hidden="true" className="size-5" strokeWidth={2.3}/>
								</Button>
							</ModalHeader>
							<ModalBody className="gap-0 px-6 py-6">
								<div className="flex gap-4 rounded-[10px] border border-[#151b38] bg-[#151b380d] px-4 py-4">
									<TriangleAlert aria-hidden="true" className="mt-[3px] size-5 shrink-0 fill-[#151b38] text-[#ffff]" strokeWidth={2}/>
									<div className="min-w-0">
										<p className="text-[15px] font-bold leading-6 tracking-normal text-[#151b38]">
											This action cannot be undone
										</p>
										<p className="mt-1 text-[14px] font-normal leading-6 tracking-normal text-[#151b38]">
											Voiding this invoice will permanently mark it as void and remove it from active billing.
										</p>
									</div>
								</div>

								<div className="mt-7 text-center">
									<p className="text-[16px] font-medium leading-6 tracking-normal text-[#1f2937]">
										Are you sure you want to Void this Invoice?
									</p>
									<p className="mt-1 text-[13px] font-normal leading-5 tracking-normal text-[#8a91a0]">
										Invoice {invoiceNumber} will be marked as void immediately.
									</p>
								</div>

								<div className="mt-7 flex items-center gap-3 rounded-[10px] border border-[#e4e7ec] bg-white px-4 py-3">
									<FileText aria-hidden="true" className="size-5 shrink-0 text-[#c5ccd6]" strokeWidth={1.9}/>
									<p className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-6 tracking-normal text-[#4b5563]">
										Invoice {invoiceNumber}
									</p>
									<span className="shrink-0 rounded-full bg-[#151b380d] px-3 py-1 text-[12px] font-bold leading-5 tracking-normal text-[#151b38]">
										WILL BE VOIDED
									</span>
								</div>

								{voidError?.response?.data?.message && (
									<div className="mt-4 rounded-[10px] border border-[#151b380d] bg-[#fff8f8] px-4 py-3">
										<div className="text-[14px] font-medium leading-5 text-[#151b38]">{voidError.response.data.message}</div>
									</div>
								)}
							</ModalBody>
							<ModalFooter className="flex justify-end gap-3 border-t border-[#f1f3f6] bg-[#fafbfc] px-6 py-4">
								<Button
									className="h-10 rounded-[10px] border border-[#dde2ea] bg-white px-6 text-[14px] font-semibold tracking-normal text-[#4b5563] shadow-none hover:bg-[#5e6480]"
									isDisabled={isVoiding}
									variant="bordered"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									className="h-10 rounded-[10px] bg-[#151b38] px-5 text-[14px] font-bold tracking-normal text-white hover:bg-[#5e6480]"
									disabled={isVoiding}
									isDisabled={isVoiding}
									onPress={handleVoidInvoice}
								>
									<Ban aria-hidden="true" className="size-4" strokeWidth={2.4}/>
									{isVoiding ? 'Voiding...' : 'Void Invoice'}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
