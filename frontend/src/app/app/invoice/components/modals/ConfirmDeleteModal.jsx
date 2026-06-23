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
import {Archive, FileText, Trash2, TriangleAlert, X} from "lucide-react";

export default function ConfirmDeleteModal() {
	const {
		isOpenConfirmDeleteModal, onOpenChangeConfirmDeleteModal,
		deleteInvoice,
		data
	} = useInvoice()
	const router = useRouter()

	const modalActionName = 'archive'
	const modalAction = 'Archiving';
	const invoiceNumber = data?.invoice_number ?? data?.id ?? "";
	const ActionIcon = Archive;
	const actionLabel = 'Archive Invoice';

  return (
    <>
      <Modal
        hideCloseButton
        isOpen={isOpenConfirmDeleteModal}
        onOpenChange={onOpenChangeConfirmDeleteModal}
        placement="center"
        size="lg"
        classNames={{
          backdrop: "bg-black/40 backdrop-blur-[1px]",
          wrapper: "px-4",
        }}
      >
        <ModalContent className="max-w-[560px] overflow-hidden rounded-[22px] bg-white p-0 shadow-[0_24px_70px_-28px_rgba(16,24,40,0.55)]">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-4 border-b border-[#eef1f5] !px-[12px] !py-[12px]">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff0f5] text-[#f31260]">
                  <FileText className="size-5" strokeWidth={2.2}/>
                </div>
                <h2 className="min-w-0 flex-1 text-[22px] font-bold leading-tight tracking-normal text-[#111827]">
                  {modalAction} Invoice <span className="text-[#f31260]">#{invoiceNumber}</span>
                </h2>
                <Button
                  isIconOnly
                  aria-label="Close invoice confirmation dialog"
                  className="h-9 w-9 min-w-9 shrink-0 rounded-full bg-transparent text-[#9ca3af] shadow-none hover:bg-[#f4f6f8] hover:text-[#4b5563]"
                  variant="light"
                  onPress={onClose}
                >
                  <X className="size-5" strokeWidth={2.2}/>
                </Button>
              </ModalHeader>
              <ModalBody className="gap-0 px-8 py-8">
                <div className="flex gap-4 rounded-[14px] border border-[#f8c8d5] bg-[#fff1f5] px-5 py-5">
                  <TriangleAlert className="mt-1 size-6 shrink-0 fill-[#f31260] text-[#f31260]" strokeWidth={2}/>
                  <div>
                    <p className="text-lg font-bold leading-7 text-[#111827]">This action cannot be undone</p>
                    <p className="mt-1 text-base leading-7 text-[#5f6675]">
                      Once {modalActionName}d, this invoice will be removed from your active invoice list and will no longer be accessible from your account.
                    </p>
                  </div>
                </div>
                <div className="mt-7 flex items-center gap-4 rounded-[14px] border border-[#eef1f5] bg-[#f9fafb] px-5 py-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[10px] border border-[#dde2ea] bg-white text-[#8b95a5]">
                    <FileText className="size-6" strokeWidth={1.9}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-bold leading-6 text-[#111827]">Invoice #{invoiceNumber}</p>
                    <p className="mt-1 text-base leading-6 text-[#8a91a0]">Will be permanently {modalActionName}d</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#fff0f5] px-4 py-2 text-sm font-bold text-[#f31260]">
                    {modalActionName}
                  </span>
                </div>
                <p className="mt-8 text-center text-lg font-normal leading-7 text-[#4b5563]">
                  Are you sure you want to {modalActionName} this Invoice?
                </p>
              </ModalBody>
              <ModalFooter className="grid grid-cols-1 gap-4 px-8 pb-8 pt-0 sm:grid-cols-2">
                <Button
                  className="h-12 rounded-[12px] border border-[#dfe3ea] bg-white text-base font-bold text-[#374151] shadow-none hover:bg-[#f9fafb]"
                  variant="bordered"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="h-12 rounded-[12px] bg-[#f31260] text-base font-bold text-white shadow-[inset_0_-4px_0_rgba(180,20,75,0.28),0_14px_24px_-16px_rgba(243,18,96,0.9)] hover:bg-[#e21158]"
                  onPress={() => deleteInvoice(data.id).then(() => router.replace(uri.invoices))}
                >
                  <ActionIcon className="size-5" strokeWidth={2.2}/>
                  {actionLabel}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
