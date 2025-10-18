"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Button} from "@heroui/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@heroui/react";
import InvoiceItem from "@/app/app/invoice/components/InvoiceItem";
import AddMoreItems from "@/app/app/invoice/components/buttons/AddMoreItems";
import InvoiceInfo from "@/app/app/invoice/components/InvoiceInfo";
import InvoiceTemplate from "@/app/app/invoice/components/InvoiceTemplate";

export default function App() {
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
                                        <Button disableRipple radius="sm" className="add-invoice-item-btn"><i className="plus-icon"></i>Add Item</Button>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <div className="px-1 py-1">
                                        <InvoiceItem />
                                        <InvoiceItem />

                                        <AddMoreItems />
                                    </div>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                    <section className="invoice-summary">
                                      <div className="summary-row">
                                        <span className="label">Subtotal:</span>
                                        <span className="value">$4,100.00</span>
                                      </div>

                                      <div className="summary-row">
                                        <span className="label">Tax (10%):</span>
                                        <span className="value">$410.00</span>
                                      </div>

                                      <hr className="divider" />

                                      <div className="summary-row total">
                                        <span className="label">Total:</span>
                                        <span className="value accent">$4,510.00</span>
                                      </div>
                                    </section>
                                </CardFooter>
                            </Card>
                            {/*<ClientInformation />*/}
                        </div>
                        <div className="w-1/3 ml-2">
                            <InvoiceTemplate />
                        </div>
                    </div>
                </div>
            </div>
        </RootLayout>
    )
}