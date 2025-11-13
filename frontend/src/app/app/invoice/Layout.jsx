"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Button} from "@heroui/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@heroui/react";
import InvoiceItem from "@/app/app/invoice/components/InvoiceItem";
import AddMoreItems from "@/app/app/invoice/components/buttons/AddMoreItems";
import InvoiceInfo from "@/app/app/invoice/components/InvoiceInfo";
import InvoiceTemplate from "@/app/app/invoice/components/InvoiceTemplate";
import {useInvoice} from "@/app/providers/InvoiceContext";
import Actions from "@/app/app/invoice/components/buttons/Actions";

export default function Layout() {
    const {
        data,
        addItems,
        onDataChange,
        updateItems,
		removeItem,
		selectedCurrency,
    } = useInvoice()

    return (
        <RootLayout>
            <div className="app app-wrapper outer-bg">
                <div className="m-auto max-w-screen-xl py-5">

                    <div className="w-full flex mb-5">
                        <div className="w-2/3">
                            <h1 className="py-1">Invoice Portal</h1>
                            <h2 className="py-1">Create and customize your invoice with items and templates</h2>
                        </div>
                        <div className="w-1/3">
                            <Button>Generate Invoice</Button>
                        </div>
                    </div>

                    <div className="w-full flex">
                        <div className="w-2/3 mr-2">
                            <InvoiceInfo />
                            <Card fullWidth radius="sm">
                                <CardHeader className="flex gap-3">
                                    <div className="flex w-full justify-between items-center">
                                        <h2>Invoice Items</h2>
                                        <Button onPress={() => addItems()} disableRipple radius="sm" className="add-invoice-item-btn"><i className="plus-icon"></i>Add Item</Button>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <div className="px-1 py-1">
                                        {data.invoice_items && Object.keys(data.invoice_items).length > 0 && data.invoice_items.map((item, index) => (
                                            <InvoiceItem
												item={item}
												key={index}
												index={index}
												onChange={updateItems}
												removeItem={removeItem}
											/>
                                        ))}

                                        <AddMoreItems link={addItems} />
                                    </div>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                  <section className="invoice-summary">
                                    <div className="summary-row">
                                      <span className="label">Subtotal (before tax):</span>
                                      <span className="value">{selectedCurrency?.symbol}{(data.subtotal_cents / 100).toFixed(2)}</span>
                                    </div>

                                    {data.shipping_cents > 0 && (
                                      <div className="summary-row">
                                        <span className="label">Shipping:</span>
                                        <span className="value">{selectedCurrency?.symbol}{(data.shipping_cents / 100).toFixed(2)}</span>
                                      </div>
                                    )}

                                    {data.shipping_tax_cents > 0 && (
                                        <div className="summary-row">
                                            <span className="label">Shipping Tax:</span>
                                            <span className="value">{selectedCurrency?.symbol}{(data.shipping_tax_cents / 100).toFixed(2)}</span>
                                        </div>
                                    )}

									{data.display_discount_row && (
									  <div className="summary-row">
										<span className="label">{data.display_discount_row.label}:</span>
										<span className="value">
										  {selectedCurrency?.symbol}{(Math.abs(data.display_discount_row.amount_cents) / 100).toFixed(2)}{/* show as positive with minus implied by label */}
										</span>
									  </div>
									)}

                                    <div className="summary-row">
                                      <span className="label">Tax (items):</span>
                                      <span className="value">{selectedCurrency?.symbol}{(data.tax_cents / 100).toFixed(2)}</span>
                                    </div>

                                    <hr className="divider" />

                                    <div className="summary-row total">
                                      <span className="label">Total:</span>
                                      <span className="value accent">{selectedCurrency?.symbol}{(data.total_cents / 100).toFixed(2)}</span>
                                    </div>
                                  </section>
                                </CardFooter>
                            </Card>
                            {/*<ClientInformation />*/}
                        </div>
                        <div className="w-1/3 ml-2">
                            <InvoiceTemplate />

							<Actions />
                        </div>
                    </div>
                </div>
            </div>
        </RootLayout>
    )
}