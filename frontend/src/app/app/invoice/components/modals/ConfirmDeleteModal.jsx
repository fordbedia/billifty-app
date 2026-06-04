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

export default function ConfirmDeleteModal() {
	const {
		isOpenConfirmDeleteModal, onOpenChangeConfirmDeleteModal,
		deleteInvoice,
		data
	} = useInvoice()
	const router = useRouter()

  return (
    <>
      <Modal isOpen={isOpenConfirmDeleteModal} onOpenChange={onOpenChangeConfirmDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
				  <h2 className="px-5 py-6">Deleting Invoice #{data.invoice_number}</h2>
			  </ModalHeader>
              <ModalBody>
               	<p>Are you sure you want to delete this Invoice?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={() => deleteInvoice(data.id).then(() => router.replace(uri.invoices))}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
