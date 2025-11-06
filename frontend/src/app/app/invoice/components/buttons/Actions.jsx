"use client"

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Button} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";

export default function Actions() {
	const {
		save
	} = useInvoice()
	return (
		 <>
			 <Card fullWidth radius="sm" className="mb-2">
					<CardHeader className="flex gap-3">
						Actions
					</CardHeader>
					<Divider />
					<CardBody>
						<Button onPress={() => save('draft')} disableRipple className="my-2" color="primary" variant="flat">Save as Draft</Button>
						<Button disableRipple className="my-2" color="success" variant="flat">Save</Button>
						<Button disableRipple className="my-2" color="warning" variant="flat">Download</Button>
					</CardBody>
			 </Card>
		</>
	)
}