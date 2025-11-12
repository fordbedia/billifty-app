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
import {Image} from "@heroui/react";

export default function Templates() {
	const {
		isOpenTemplate,
		onOpenChangeTemplate,
		templates,
		setSelectedTemplate,
		onOpenColorScheme
	} = useInvoice()

  return (

    <>
      <Modal className="modal modal__templates" size="3xl" isOpen={isOpenTemplate} onOpenChange={onOpenChangeTemplate}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
				  Template Selection
			  </ModalHeader>
              <ModalBody>
				  <div className="flex">
					  {templates && Object.keys(templates).length > 0 && templates.map(t => (
						  <div key={t.id} className="w-1/2">
							  <div className="box flex justify-center px-2 py-5" onClick={() => {
								  setSelectedTemplate(t);
								  onOpenColorScheme();
								  onClose();
							  }}>
								  <Image
									alt={t.display_name}
									src={t.preview_url}
									width={300}
								  />
							  </div>
						  </div>
					  ))}
				  </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
