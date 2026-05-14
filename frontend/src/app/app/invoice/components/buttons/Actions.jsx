"use client"

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Button} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {Alert} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

export default function Actions({isIssuedOrPaid, isPaid}) {
	const {
		save,
		data,
		clearSticky,
		isEmpty,
		onOpenConfirmIssueInvoice,
		invoiceId,
		createInvoiceError,
		updateError,
		onOpenConfirmDeleteModal,
		isOpenPreviewInvoiceModal, onOpenPreviewInvoiceModal, onOpenChangePreviewInvoiceModal,
		generatePdf
	} = useInvoice()

	const confirm = () => {
		onOpenConfirmIssueInvoice()
	}

	let errors = null;
	if (
		(
			typeof createInvoiceError !== 'undefined' &&
			typeof createInvoiceError?.response?.data?.error_code === 'undefined'
		)
			&&
		(
			typeof createInvoiceError !== 'undefined' &&
			createInvoiceError &&
			Object.keys(createInvoiceError).length > 0
		) ||
		(
			typeof updateError !== 'undefined' &&
			updateError &&
			Object.keys(updateError).length > 0
		)
	) {
		errors = createInvoiceError?.response?.data?.errors ?? updateError?.response?.data?.errors;
	}
	if(
			typeof createInvoiceError !== 'undefined' &&
			typeof createInvoiceError?.response?.data?.error_code !== 'undefined'
		) {
		errors = createInvoiceError?.response?.data?.message;
	}

	 return (
		 <>
			 <Card fullWidth radius="sm" className="mb-2 workspace-card invoice-side-card">
					<CardHeader className="flex gap-3">
						<div>
							<h3>Actions</h3>
							<p className="text-sm text-default-500">Save, preview, download, and send from one place.</p>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="invoice-actions-body">
						{errors && typeof errors !== 'string' && Object.keys(errors).length > 0 && (
							<Alert color="danger">
								<ul>
									{Object.entries(errors).map(([k, v]) => (
										<li>{v}</li>
									))}
								</ul>
							</Alert>
						)}
						{errors && typeof errors === 'string' && (
							<Alert color="danger">
								{errors}
							</Alert>
						)}
						{!invoiceId
							? (<Button onPress={() => save('save_draft')} disableRipple className="my-2 text-white w-full" color="success">Create Invoice</Button>)
							: (!isPaid && (<Button onPress={() => save('save_changes')} disableRipple className="my-2 w-full" color="primary" variant="flat">Save Changes</Button>))}
						{!isIssuedOrPaid && (
							<Button onPress={confirm} isDisabled={!data.id} disableRipple className="my-2 w-full" color="warning" variant="flat">Issue Invoice</Button>
						)}

						{!invoiceId && !isEmpty && (<Button disableRipple className="my-2 w-full" color="danger" onPress={clearSticky}>Reset All</Button>)}
						{invoiceId && (<Button className="my-2 w-full" color="secondary" onPress={onOpenPreviewInvoiceModal}>Preview Invoice</Button>)}
						{invoiceId && isPaid && (<Button onPress={generatePdf} className="my-2 w-full" color="primary">Quick Download</Button>)}

						{invoiceId && !isPaid && (<Button className="my-2 text-white w-full" as={Link} href={uri.send_invoice(invoiceId)} color="success">Send/Download Invoice</Button> )}

						<div className="invoice-ai-note">
							<div className="invoice-ai-note-head">AI Invoice Draft (Beta)</div>
							<p>Describe your work in chat, then review the generated invoice draft before sending.</p>
						</div>

						{invoiceId && (
							<>
								<Divider className="border-2" />
								<Button className="my-2 font-bold w-full" onPress={onOpenConfirmDeleteModal} color="danger">Delete</Button>
							</>
						)}
					</CardBody>
			 </Card>
		</>
	)
}
