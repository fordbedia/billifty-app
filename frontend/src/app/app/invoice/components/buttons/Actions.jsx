"use client"

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Button} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";

export default function Actions() {
	const {
		save,
		data,
		clearSticky,
		isStorageEmpty,
	} = useInvoice()
	return (
		 <>
			 <Card fullWidth radius="sm" className="mb-2">
					<CardHeader className="flex gap-3">
						Actions
					</CardHeader>
					<Divider />
					<CardBody>
						{!data?.id
							? (<Button onPress={() => save('save_draft')} disableRipple className="my-2" color="primary" variant="flat">Save as Draft</Button>)
							: (<Button onPress={() => save('save_changes')} disableRipple className="my-2" color="primary" variant="flat">Save Update</Button>)}
						<Button onPress={() => save('issue')} isDisabled={!data.id} disableRipple className="my-2" color="success" variant="flat">Issue Invoice</Button>
						<Button isDisabled={!data.id} disableRipple className="my-2" color="warning" variant="flat">Download</Button>
						{!data?.id && !isStorageEmpty() && (<Button disableRipple className="my-2" color="danger" onPress={clearSticky}>Reset All</Button>)}
					</CardBody>
			 </Card>
		</>
	)
}