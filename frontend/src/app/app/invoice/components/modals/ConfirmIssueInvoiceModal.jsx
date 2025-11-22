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

export default function ConfirmIssueInvoiceModal() {
  const {
	  isOpenConfirmIssueInvoice,
	  onOpenChangeConfirmIssueInvoice,
	  save,
  } = useInvoice()
  return (
    <>
      <Modal isOpen={isOpenConfirmIssueInvoice} onOpenChange={onOpenChangeConfirmIssueInvoice}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Issue Invoice</ModalHeader>
              <ModalBody>
                <strong>Are you sure you want to issue this invoice? This action cannot be undone.</strong>
				  <p>Once issued, the following fields can no longer be edited: Invoice Number, Client, Issue Date, Due Date and Currency.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="warning" onPress={() => save('issue', () => onClose())}>
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
