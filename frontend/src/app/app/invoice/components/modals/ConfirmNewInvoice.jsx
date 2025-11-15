import { useInvoice } from "@/app/providers/InvoiceContext";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function ConfirmNewInvoice() {
  const {
    isOpenConfirmNewInvoice,
    onOpenChangeConfirmNewInvoice,
    clearSticky, // maybe you want to reuse this
    router,
  } = useInvoice();

  return (
    <>
      {/* your invoice form UI here */}

      <Modal isOpen={isOpenConfirmNewInvoice} onOpenChange={onOpenChangeConfirmNewInvoice}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create a new invoice?</ModalHeader>
              <ModalBody>
                <p>
                  You just came from an existing invoice. Do you want to start a brand new invoice?
                  Any unsaved changes on the previous invoice won’t be carried over.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => {  onClose(); }}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => { onClose(); }}>
                  Create invoice
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
