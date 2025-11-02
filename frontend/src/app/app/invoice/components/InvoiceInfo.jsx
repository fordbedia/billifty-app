import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button, DatePicker} from "@heroui/react";
import {Select, SelectItem} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";

export default function InvoiceInfo() {
    const {
        businessProfileData
    } = useInvoice()

    return (
        <Card className="mb-5" fullWidth radius="sm">
            <CardHeader className="flex gap-3">
                <h2>Create New Invoice</h2>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                    <div className="md:w-1/2">
                        Business Profile
                        <Select className="max-w-xs" label="Select a Business Profile">
                            {businessProfileData && Object.keys(businessProfileData).length > 0 && businessProfileData.map(b =>
                                <SelectItem key={b.id}>{b.name}</SelectItem>
                            )}
                        </Select>
                        <Input
                            isRequired
                            errorMessage="Please enter a valid name"
                            labelPlacement="outside"
                            name="client_name"
                            placeholder="Enter your name"
                            type="text"
                            variant="bordered"
                            radius="sm"
                          />
                    </div>
                    <div className="md:w-1/2">
                        Invoice Number
                        <Input
                            isRequired
                            errorMessage="Please enter a valid name"
                            labelPlacement="outside"
                            name="client_name"
                            placeholder="Enter your name"
                            type="text"
                            variant="bordered"
                            radius="sm"
                          />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                     <div className="md:w-1/2">
                        Issue Date
                        <DatePicker isRequired label="Birth date" />
                    </div>
                    <div className="md:w-1/2">
                        Due Date
                        <DatePicker isRequired label="Birth date" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                    <div className="md:w-1/2">
                        Your Client/Bill To
                        <Input
                            isRequired
                            errorMessage="Please enter a valid name"
                            labelPlacement="outside"
                            name="client_name"
                            placeholder="Enter your name"
                            type="text"
                            variant="bordered"
                            radius="sm"
                          />
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}