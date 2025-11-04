"use client";

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button, DatePicker} from "@heroui/react";
import {Select, SelectItem} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";

export default function InvoiceInfo() {
    const {
        businessProfileData,
        clientData,
        data,
        onDataChange,
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
                        <Select
                            className="max-w-xs"
                            label="Select a Business Profile"
                            onSelectionChange={(val) => onDataChange('business_profile_id', val)}
                        >
                            {businessProfileData && Object.keys(businessProfileData).length > 0 && businessProfileData.map(b =>
                                <SelectItem key={b.id}>{b.name}</SelectItem>
                            )}
                        </Select>
                    </div>
                    <div className="md:w-1/2">
                        Invoice Number
                        <Input
                            isRequired
                            errorMessage="Please enter a valid name"
                            labelPlacement="outside"
                            name="invoice_number"
                            placeholder="Enter Invoice Number"
                            type="text"
                            variant="bordered"
                            radius="sm"
                            value={data.invoice_number}
                            onValueChange={(val) => onDataChange('invoice_number', val)}
                          />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                     <div className="md:w-1/2">
                        Issue Date
                        <DatePicker
                            className="max-w-[284px]"
                            label="Birth date"
                            granularity="day"
                            value={data.issued_on}
                            onChange={(v) => onDataChange('issued_on', v)}
                        />
                    </div>
                    <div className="md:w-1/2">
                        Due Date
                        <DatePicker
                            className="max-w-[284px]"
                            label="Birth date"
                            granularity="day"
                            value={data.due_on}
                            onChange={(v) => onDataChange('due_on', v)}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                    <div className="md:w-1/2">
                        Your Client/Bill To
                        <Select
                            className="max-w-xs"
                            label="Select a Business Profile">
                            onSelectionChange={(val) => onDataChange('client_id', val)}
                            {clientData && Object.keys(clientData).length > 0 && clientData.map(b =>
                                <SelectItem key={b.id}>{b.name}</SelectItem>
                            )}
                        </Select>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}