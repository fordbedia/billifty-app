"use client"

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Button} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {Alert} from "@heroui/react";

export default function Actions() {
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
	} = useInvoice()

	const confirm = () => {
		onOpenConfirmIssueInvoice()
	}

	let errors = null;
	if (
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

	return (
		 <>
			 <Card fullWidth radius="sm" className="mb-2">
					<CardHeader className="flex gap-3">
						Actions
					</CardHeader>
					<Divider />
					<CardBody>
						{errors && Object.keys(errors).length > 0 && (
							<Alert color="danger">
								<ul>
									{Object.entries(errors).map(([k, v]) => (
										<li>{v}</li>
									))}
								</ul>
							</Alert>
						)}
						{!invoiceId
							? (<Button onPress={() => save('save_draft')} disableRipple className="my-2" color="success">Create Invoice</Button>)
							: (<Button onPress={() => save('save_changes')} disableRipple className="my-2" color="primary" variant="flat">Save Changes</Button>)}
						{invoiceId && data.status !== 'issued' && (
							<Button onPress={confirm} isDisabled={!data.id} disableRipple className="my-2" color="warning" variant="flat">Issue Invoice</Button>
						)}
						{invoiceId && data.status === 'issued' && (<Button isDisabled={!data.id} disableRipple className="my-2" color="warning" variant="flat">Download</Button>)}
						{!invoiceId && !isEmpty && (<Button disableRipple className="my-2" color="danger" onPress={clearSticky}>Reset All</Button>)}
						{invoiceId && (<Button onPress={onOpenConfirmDeleteModal} color="danger">Delete</Button>)}
					</CardBody>
			 </Card>
		</>
	)
}