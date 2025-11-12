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

export default function ColorSchemes() {
	const {
		isOpenColorScheme,
		onOpenChangeTemplate,
		setSelectedColorScheme,
		onOpenChangeColorScheme,

		colorSchemeData
	} = useInvoice()

  return (

    <>
      <Modal className="modal modal__templates" size="sm" isOpen={isOpenColorScheme} onOpenChange={onOpenChangeColorScheme}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
				  Template Selection
			  </ModalHeader>
              <ModalBody>
				  <div className="flex">
						  <div className="box-design-wrapper">
								<div className="design-box py-3 w-full">
								{colorSchemeData && Object.keys(colorSchemeData).length > 0 && colorSchemeData.map(t => (
									<div key={t.id} onClick={() => {
										setSelectedColorScheme(t)
										onClose()
									}} className="inner-box rounded-md px-5 py-3 mx-3 my-3">
										<div className="flex flex-nowrap">
											<Image
												radius="none"
												priority="true"
												quality={100}
												width={94}
												height={31}
												src={t.preview_url} alt="Modern Design" />
											<h3 className="py-1 px-3">{t.color_scheme_name}</h3>
										</div>
									</div>
								))}
							</div>
						</div>
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
