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

export default function ConfirmVoidInvoiceModal() {
	const {
		isOpenConfirmVoidInvoiceModal, onOpenChangeConfirmVoidInvoiceModal,
		data,
		voidInvoice, voidError, voidIsPending
	} = useInvoice()
	const router = useRouter()
	const [isRedirecting, setIsRedirecting] = useState(false);
	const isVoiding = voidIsPending || isRedirecting;

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
			<Modal isOpen={isOpenConfirmVoidInvoiceModal} onOpenChange={onOpenChangeConfirmVoidInvoiceModal}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="px-5 py-6">VOID Invoice #{data.invoice_number}</h2>
							</ModalHeader>
							<ModalBody>
								<p>Are you sure you want to Void this Invoice?</p>

								{voidError?.response?.data?.message && (
									<div>
										<div className="text-red-600 text-base">{voidError.response.data.message}</div>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" isDisabled={isVoiding} onPress={onClose}>
									Close
								</Button>
								<Button color="danger"
										disabled={isVoiding}
										isDisabled={isVoiding}
										onPress={handleVoidInvoice}>
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
