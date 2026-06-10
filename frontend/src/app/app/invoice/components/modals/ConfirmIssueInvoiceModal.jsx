"use client"

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {useRouter} from "next/navigation";

export default function ConfirmIssueInvoiceModal({invoiceId}) {
	const {
		isOpenConfirmIssueInvoice,
		onOpenChangeConfirmIssueInvoice,
		save,
	} = useInvoice()
	const router = useRouter()
	return (
		<>
			<Modal isOpen={isOpenConfirmIssueInvoice} onOpenChange={onOpenChangeConfirmIssueInvoice}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="px-6 py-3">Issue Invoice</h2>
							</ModalHeader>
							<ModalBody>
								<strong>Are you sure you want to issue this invoice?</strong>
								<p>Once issued, financial and client-related fields will be locked and cannot be edited.
									Only Notes and Terms can still be updated.</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="warning" onPress={() => save('issue', () => {
									onClose();
									router.replace(`/app/invoice/${invoiceId}/send`)
								}).catch(() => {})}>
									Issue Invoice
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
