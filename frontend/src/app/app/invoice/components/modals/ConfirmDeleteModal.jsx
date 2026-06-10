import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {useRouter} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {capitalize} from "@/app/utils/strings";

export default function ConfirmDeleteModal() {
	const {
		isOpenConfirmDeleteModal, onOpenChangeConfirmDeleteModal,
		deleteInvoice,
		data
	} = useInvoice()
	const router = useRouter()

	const modalTitle = data?.status === 'paid' ? 'archive' : 'delete';

	const modalAction = data?.status === 'paid' ? 'Archiving' : 'Deleting';

  return (
    <>
      <Modal isOpen={isOpenConfirmDeleteModal} onOpenChange={onOpenChangeConfirmDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
				  <h2 className="px-5 py-6">{modalAction} Invoice #{data.invoice_number}</h2>
			  </ModalHeader>
              <ModalBody>
               	<p>Are you sure you want to {modalTitle} this Invoice?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={() => deleteInvoice(data.id).then(() => router.replace(uri.invoices))}>
					{capitalize(modalTitle)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
