"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Card, CardBody, CardHeader, Form, Button, Input, Select, SelectItem, Link, Alert} from "@heroui/react";
import {useRef, useState} from "react";
import {useClient} from "@/app/providers/ClientProvider";
import ConfirmDelete from "@/app/app/invoice/business-profile/modals/ConfirmDelete";

export default function ClientApp () {
	const {
		mode,
	} = useClient()

	return (
		<RootLayout>
			<ConfirmDelete />
			 <div className="m-auto max-w-screen-xl py-5">
          <div className="w-full mb-5">
						<div className="text-center py-7">
							<h2 className="text-4xl font-bold">Set Up Your Client</h2>
							<h3 className="text-lg">Add your Client to create professional invoices that reflect your brand identity.</h3>
						</div>

						 <Card className="mt-4" fullWidth radius="sm">
                <CardBody>
									<Form className="w-full px-3 my-4">
										<div className="w-full">
											<h2 className="py-7 text-xl font-semibold">Client Information</h2>

											{/* Name & Company */}
											<div className="flex gap-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="name"
														label="Client name / primary contact"
														labelPlacement="outside"
														description="Who should appear as the main contact on this client's invoices."
														placeholder="e.g., John Smith"
													/>
												</div>
												<div className="w-1/2">
													<Input
														isRequired
														name="company"
														label="Company / organization (legal name)"
														labelPlacement="outside"
														description="Registered business name, if different from the client name."
														placeholder="e.g., Acme Construction LLC"
													/>
												</div>
											</div>

											{/* Email & Phone */}
											<div className="flex gap-4 mt-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="email"
														label="Email"
														labelPlacement="outside"
														description="We'll use this email to send invoices, quotes, and receipts."
														placeholder="e.g., billing@acmeconstruction.com"
													/>
												</div>
												<div className="w-1/2">
													<Input
														isRequired
														name="phone"
														label="Phone number"
														labelPlacement="outside"
														description="Primary contact number for this client."
														placeholder="e.g., +1 (555) 123-4567"
													/>
												</div>
											</div>

											{/* Tax ID & License */}
											<div className="flex gap-4 mt-4">
												<div className="w-1/2">
													<Input
														name="tax_id"
														label="Tax ID"
														labelPlacement="outside"
														description="Client's tax identification number (EIN, VAT, or local tax ID), if applicable."
														placeholder="e.g., 12-3456789"
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="license_no"
														label="Business / license number"
														labelPlacement="outside"
														description="Any professional or business license number you'd like to appear on invoices."
														placeholder="e.g., Contractor license #C-123456"
													/>
												</div>
											</div>

											{/* Address lines */}
											<div className="flex gap-4 mt-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="address_line1"
														label="Address line 1"
														labelPlacement="outside"
														description="Street address, P.O. box, or building name."
														placeholder="e.g., 123 Main St, Suite 400"
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="address_line2"
														label="Address line 2"
														labelPlacement="outside"
														description="Apartment, unit, floor, or additional address details (optional)."
														placeholder="e.g., Building B, Unit 12"
													/>
												</div>
											</div>

											{/* City & State */}
											<div className="flex gap-4 mt-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="city"
														label="City"
														labelPlacement="outside"
														placeholder="e.g., Houston"
													/>
												</div>
												<div className="w-1/2">
													<Input
														isRequired
														name="state"
														label="State / province / region"
														labelPlacement="outside"
														placeholder="e.g., TX"
													/>
												</div>
											</div>

											{/* Postal code & Country */}
											<div className="flex gap-4 mt-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="postal_code"
														label="Postal / ZIP code"
														labelPlacement="outside"
														placeholder="e.g., 77001"
													/>
												</div>
												<div className="w-1/2">
													<Input
														isRequired
														name="country"
														label="Country"
														labelPlacement="outside"
														placeholder="e.g., United States"
													/>
												</div>
											</div>


											{/*<div className="errors">*/}
											{/*	{typeof errors !== undefined && errors && Object.keys(errors).length > 0 && (*/}
											{/*		<Alert color="danger">*/}
											{/*			<ul>*/}
											{/*				{errors?.map((v, k) => (<li key={k}>{v}</li>))}*/}
											{/*			</ul>*/}
											{/*		</Alert>*/}
											{/*	)}*/}
											{/*</div>*/}

											<div className="flex gap-4 py-4 justify-between">
												<div>
													<Button className="mr-2" as={Link} href="/app/invoice/business-profile">{mode === 'new' ? 'Cancel' : 'Back'}</Button>
													<Button className="mr-2" type="button" color="primary" variant="flat">{mode === 'new' ? 'Submit' : 'Save Changes'}</Button>
												</div>
												<div>
													{mode === 'edit' && (<Button color="danger">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
															<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
														</svg>
														Delete
													</Button>)}
												</div>
											</div>

										</div>
									</Form>
								</CardBody>
						 </Card>

					</div>
			 </div>
		</RootLayout>
	)
}