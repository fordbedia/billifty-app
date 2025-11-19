import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {useBusinessProfile} from "@/app/providers/BusinessProfileContext";

export default function ConfirmDelete() {
	const {
		isOpenConfirmDeleteModal,
		onOpenChangeConfirmDeleteModal,
		deleteBusinessProfile,
	} = useBusinessProfile()
  return (
    <>
      <Modal isOpen={isOpenConfirmDeleteModal} onOpenChange={onOpenChangeConfirmDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Business Profile</ModalHeader>
              <ModalBody>
                Are you sure you want to delete?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={deleteBusinessProfile}>
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
