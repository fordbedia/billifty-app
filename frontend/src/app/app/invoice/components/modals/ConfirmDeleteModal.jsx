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

export default function ConfirmDeleteModal() {
	const {
		isOpenConfirmDeleteModal, onOpenChangeConfirmDeleteModal,
		deleteInvoice,
		data
	} = useInvoice()

  return (
    <>
      <Modal isOpen={isOpenConfirmDeleteModal} onOpenChange={onOpenChangeConfirmDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Deleting Invoice #{data.invoice_number}</ModalHeader>
              <ModalBody>
               	<p>Are you sure you want to delete this Invoice?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={deleteInvoice}>
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
