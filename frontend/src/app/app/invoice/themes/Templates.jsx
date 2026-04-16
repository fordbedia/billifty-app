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
              <ModalHeader className="flex flex-col gap-4">
								<h2 className="mx-4 py-4">Template Selection</h2>
			  			</ModalHeader>
              <ModalBody>
					<div className="grid grid-cols-3 gap-4">
					  {Array.isArray(templates) && templates.length > 0 && templates.map(t => (
						  <div key={t.id}>
							  <div className="box flex justify-center px-2 py-5" onClick={() => {
								  setSelectedTemplate(t);
								  onOpenColorScheme();
								  onClose();
							  }}>
								  <Image
										alt={t.display_name}
										src={t.preview_url}
										width={200}
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
