"use client";

import { useEffect, useState } from "react";
import {auth} from "@/app/helpers/auth";
import Invoice from "@/app/models/Invoices";
import {useQuery} from "@tanstack/react-query";
import {Modal, ModalBody, ModalContent, ModalHeader} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";

export default function InvoicePreviewPage({ invoiceId }) {
	const {
		isOpenPreviewInvoiceModal, onOpenChangePreviewInvoiceModal
	} = useInvoice()
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

	const {data: invoiceUrl, isSuccess} = useQuery({
		queryKey: ['preview-invoice', invoiceId],
		queryFn: async () => (await Invoice.preview(invoiceId))?.data,
		enabled: !!invoiceId,
		retry: false
	})

  useEffect(() => {
    let isMounted = true;
		if (isSuccess) {
			setPreviewUrl(invoiceUrl.url)
		}
    return () => {
      isMounted = false;
    };
  }, [invoiceUrl, isSuccess]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading invoice preview: {error}
      </div>
    );
  }

  // if (!previewUrl) {
  //   return (
  //     <div className="p-4">
  //       Loading preview...
  //     </div>
  //   );
  // }

  return (
		<Modal
        isOpen={isOpenPreviewInvoiceModal}
        onOpenChange={onOpenChangePreviewInvoiceModal}
        size="full" // big modal
        scrollBehavior="inside"
      >
        <ModalContent>
     			{(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <span>Invoice Preview #{invoiceId}</span>
              </ModalHeader>
              <ModalBody className="p-0">
                {/* Reuse the same iframe preview, but let it take more space */}
                <div>
									{previewUrl && (
										<iframe
											src={previewUrl}
											className="invoice-preview-frame"
											title={`Invoice ${invoiceId} preview`}
										/>
									)}
								</div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
