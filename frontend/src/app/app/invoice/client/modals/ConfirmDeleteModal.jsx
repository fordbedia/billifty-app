import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {useClient} from "@/app/providers/ClientProvider";

export default function ConfirmDeleteModal() {
	const {
		confirmDeleteModalIsOpen,
		confirmDeleteModalOnOpenChange,
		archiveClient,
	} = useClient()

  return (
    <>
      <Modal isOpen={confirmDeleteModalIsOpen} onOpenChange={confirmDeleteModalOnOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Archiving Client Data</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={archiveClient}>
                  Archive
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
