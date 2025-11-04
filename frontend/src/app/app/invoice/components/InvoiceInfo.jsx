"use client";

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button, DatePicker} from "@heroui/react";
import {Select, SelectItem, Checkbox} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {centsToDollarsStr, dollarsToCents} from "@/app/utils/computeInvoice";

export default function InvoiceInfo() {
    const {
        businessProfileData,
        clientData,
        data,
        onDataChange,
        setHasShipping,
        hasShipping,
        isTaxable,
        setIsTaxable,
    } = useInvoice()

	const enableShipping = () => {
		setHasShipping(true);
		if (data.shipping_cents == null) onDataChange("shipping_cents", 0);
		if (data.shipping_tax_rate == null) onDataChange("shipping_tax_rate", 0);
	};

    const disableShipping = () => {
      setHasShipping(false);
      setIsTaxable(false);
      onDataChange("shipping_address", "");
      onDataChange("shipping_cents", 0);
      onDataChange("shipping_tax_rate", 0);
    };
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
                            selectionMode="single"
                            onSelectionChange={(val) => onDataChange('business_profile_id', Array.from(keys)[0] ?? null)}
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
                            label="Select a Client"
                            selectionMode="single"
                            onSelectionChange={(val) => onDataChange('client_id', Array.from(keys)[0] ?? null)}>
                            {clientData && Object.keys(clientData).length > 0 && clientData.map(b =>
                                <SelectItem key={b.id}>{b.name}</SelectItem>
                            )}
                        </Select>
                    </div>
                    <div className="md:w-1/2 content-center">
                        {!hasShipping
                            ? (<Link onPress={enableShipping}>Add Shipping</Link>)
                            : (
                               <>
                                  <Input
                                    isRequired={hasShipping}
                                    errorMessage="Please enter a shipping address"
                                    labelPlacement="outside"
                                    name="shipping_address"
                                    placeholder="Enter Shipping Address"
                                    type="text"
                                    variant="bordered"
                                    radius="sm"
                                    value={data.shipping_address ?? ""}
                                    onValueChange={(val) => onDataChange("shipping_address", val)}
                                    className="mb-3"
                                  />

                                  {/* UI shows dollars; state stores cents */}
                                  <Input
                                    isRequired={hasShipping}
                                    errorMessage="Please enter a shipping cost"
                                    labelPlacement="outside"
                                    name="shipping_cents_display"
                                    placeholder="Enter Shipping Cost (e.g., 12.99)"
                                    type="number"
                                    variant="bordered"
                                    radius="sm"
                                    value={centsToDollarsStr(data.shipping_cents ?? 0)}
                                    onValueChange={(val) => onDataChange("shipping_cents", dollarsToCents(val))}
                                    className="mb-3"
                                  />

                                  <Checkbox
                                    isSelected={isTaxable}
                                    onValueChange={(checked) => {
                                      setIsTaxable(checked);
                                      if (!checked) onDataChange("shipping_tax_rate", 0);
                                    }}
                                    className="mb-2"
                                  >
                                    Shipping is taxable
                                  </Checkbox>

                                  {isTaxable && (
                                    <Input
                                      isRequired={hasShipping && isTaxable}
                                      errorMessage="Enter a tax rate like 8.25 for 8.25%"
                                      labelPlacement="outside"
                                      name="shipping_tax_rate"
                                      placeholder="Enter Shipping Tax Rate (%)"
                                      type="number"
                                      variant="bordered"
                                      radius="sm"
                                      value={String(data.shipping_tax_rate ?? 0)}
                                      onValueChange={(val) =>
                                        onDataChange("shipping_tax_rate", parseFloat(val) || 0)
                                      }
                                      className="mb-3"
                                    />
                                  )}
								   <br />
                                  <Link onPress={disableShipping}>Remove Shipping</Link>
                                </>
                            )}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}