"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Card, CardBody, CardHeader, Form, Button, Input, Select, SelectItem, Link} from "@heroui/react";
import {useRef, useState} from "react";
import {useBusinessProfile} from "@/app/providers/BusinessProfileContext";

export default function BusinessProfileAppForm () {
	const {
		handleClick,
		handleFileChange,
		preview,
		inputRef,
		paymentMethods,
		handleFormChange,
		businessProfileForm,
		paymentInfoForm,
		submitForm,
		save,
	} = useBusinessProfile()

	return (
		<RootLayout>
			 <div className="m-auto max-w-screen-xl py-5">
          <div className="w-full mb-5">
						<div className="text-center py-7">
							<h2 className="text-4xl font-bold">Set Up Your Business Profile</h2>
							<h3 className="text-lg">Add your business information to create professional invoices that reflect your brand identity.</h3>
						</div>

						 <Card className="mt-4" fullWidth radius="sm">
                <CardBody>
									<Form className="w-full px-3 my-4">
										<div>
											<h2 className="pb-3">Business Logo</h2>
											<div className="flex items-center gap-6">
												{/* Logo preview / placeholder */}
												<button
													type="button"
													onClick={handleClick}
													className="
														flex items-center justify-center
														w-24 h-24
														rounded-md
														border-2 border-dashed border-[#CCD3DD]
														bg-[#F9FBFF]
														text-[#9AA3B5]
														hover:border-[#57B9FF]
														transition-colors
													"
												>
													{preview ? (
														// Previewed logo
														<img
															src={preview}
															alt="Logo preview"
															className="max-w-full max-h-full object-contain"
														/>
													) : (
														// Placeholder icon
														<svg
															aria-hidden="true"
															className="w-8 h-8"
															viewBox="0 0 24 24"
															fill="none"
														>
															<rect
																x="3"
																y="3"
																width="18"
																height="18"
																rx="3"
																stroke="currentColor"
																strokeWidth="1.6"
															/>
															<circle
																cx="9"
																cy="9"
																r="2"
																stroke="currentColor"
																strokeWidth="1.6"
															/>
															<path
																d="M7 17L11 13L14 16L17 13L21 17"
																stroke="currentColor"
																strokeWidth="1.6"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													)}
												</button>

												{/* Upload button + helper text */}
												<div className="flex flex-col">
													<Button
														color="primary"
														radius="sm"
														className="
															px-6
															h-11
															text-sm font-semibold
															flex items-center gap-2
														"
														onPress={handleClick}
													>
														{/* Upload icon */}
														<svg
															aria-hidden="true"
															className="w-4 h-4"
															viewBox="0 0 24 24"
															fill="none"
														>
															<path
																d="M12 16V5M12 5L7.5 9.5M12 5L16.5 9.5"
																stroke="currentColor"
																strokeWidth="1.8"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M5 18.5C5 17.3954 5.89543 16.5 7 16.5H17C18.1046 16.5 19 17.3954 19 18.5V19"
																stroke="currentColor"
																strokeWidth="1.8"
																strokeLinecap="round"
															/>
														</svg>
														Upload Logo
													</Button>

													<span className="mt-2 text-xs text-[#7A8497]">
														Recommended: 200×200px, PNG or JPG format
													</span>
												</div>

												{/* Hidden file input */}
												<input
													ref={inputRef}
													type="file"
													accept="image/png,image/jpeg"
													className="hidden"
													onChange={handleFileChange}
												/>
											</div>
										</div>

										<div className="w-full">
											<h2 className="py-7 text-xl font-semibold">Business Information</h2>
											<div className="flex gap-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="name"
														label="Business Name (Your “Trade Name“ or “Brand Name“)"
														labelPlacement="outside"
														placeholder="Enter your business name"
														onValueChange={(value) => handleFormChange('bp', 'name', value)}
														value={businessProfileForm.name}
													/>
												</div>
												<div className="w-1/2">
													<Input
														isRequired
														name="legal_name"
														label="Legal Name (“Registered Business Name”) "
														labelPlacement="outside"
														placeholder="Enter your Legal Name"
														onValueChange={(value) => handleFormChange('bp', 'legal_name', value)}
														value={businessProfileForm.legal_name}
													/>
												</div>
											</div>

											<div className="flex gap-6 py-4">
												<div className="w-1/2">
													<Input
														name="tax_id"
														label="Tax ID (Optional)"
  													placeholder="e.g. EIN: 12-3456789, TIN: 123-456-789-000, VAT: GB123456789"
														labelPlacement="outside"
														description="Used for tax and business compliance. Leave blank if you don't have one."
														onValueChange={(value) => handleFormChange('bp', 'tax_id', value)}
														value={businessProfileForm.tax_id}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="license_no"
														placeholder="e.g. Contractor License: TX-098765 or PRC: 1234567"
														description="Only required for certain professions. Leave blank if not applicable."
														labelPlacement="outside"
														label="Business or Professional License No. (Optional)"
														onValueChange={(value) => handleFormChange('bp', 'license_no', value)}
														value={businessProfileForm.license_no}
													/>
												</div>
											</div>

											<h2 className="py-7 text-xl font-semibold">Contact Information</h2>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														isRequired
														name="email"
														label="Email Address"
														labelPlacement="outside"
														placeholder="contact@yourbusiness.com"
														onValueChange={(value) => handleFormChange('bp', 'email', value)}
														value={businessProfileForm.email}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="phone"
														label="Phone Number"
														labelPlacement="outside"
														placeholder="(555) 123-4567"
														onValueChange={(value) => handleFormChange('bp', 'phone', value)}
														value={businessProfileForm.phone}
													/>
												</div>
											</div>

											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="address_line1"
														label="Address 1"
														labelPlacement="outside"
														placeholder="Enter your address 1"
														onValueChange={(value) => handleFormChange('bp', 'address_line1', value)}
														value={businessProfileForm.address_line1}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="address_line2"
														label="Address 2"
														labelPlacement="outside"
														placeholder="Enter your address 2"
														onValueChange={(value) => handleFormChange('bp', 'address_line2', value)}
														value={businessProfileForm.address_line2}
													/>
												</div>
											</div>

											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="city"
														label="City"
														labelPlacement="outside"
														placeholder="Enter your city"
														onValueChange={(value) => handleFormChange('bp', 'city', value)}
														value={businessProfileForm.city}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="state"
														label="State"
														labelPlacement="outside"
														placeholder="Enter your state"
														onValueChange={(value) => handleFormChange('bp', 'state', value)}
														value={businessProfileForm.state}
													/>
												</div>
											</div>

											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="postal_code"
														label="ZIP/Postal Code"
														labelPlacement="outside"
														placeholder="10001"
														onValueChange={(value) => handleFormChange('bp', 'postal_code', value)}
														value={businessProfileForm.postal_code}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="country"
														label="Country"
														labelPlacement="outside"
														placeholder="Enter your country"
														onValueChange={(value) => handleFormChange('bp', 'country', value)}
														value={businessProfileForm.country}
													/>
												</div>
											</div>

											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="website"
														label="Website"
														labelPlacement="outside"
														placeholder="Enter website"
														onValueChange={(value) => handleFormChange('bp', 'website', value)}
														value={businessProfileForm.website}
													/>
												</div>
											</div>
											<h2 className="py-7 text-xl font-semibold">Payment Information</h2>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													 <Select
														 name="payment_method"
														 label="Select your payment method"
														 placeholder="Payment Method"
														 labelPlacement="outside"
														 selectedKeys={
																paymentInfoForm.payment_method ? new Set([String(paymentInfoForm.payment_method)]) : new Set()
													 		}
														 onSelectionChange={(keys) => handleFormChange('pi', 'payment_method', Array.from(keys)[0] ?? null)}
													 >
														 {paymentMethods && paymentMethods.map(m => (
															 <SelectItem key={m.key}>{m.label}</SelectItem>
														 ))}
													</Select>
												</div>
												<div className="w-1/2">
													<Input
														name="bank_name"
														label="Bank Name"
														labelPlacement="outside"
														placeholder="Enter your bank name"
														onValueChange={(value) => handleFormChange('pi', 'bank_name', value)}
														value={paymentInfoForm.bank_name}
													/>
												</div>
											</div>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													 <Input
														name="account_name"
														label="Account Holder Name"
														placeholder="e.g. Ed Bedia or EHD Enterprise LLC"
														description="Name registered with your bank."
														onValueChange={(value) => handleFormChange('pi', 'account_name', value)}
														value={paymentInfoForm.account_name}
													/>
												</div>
												<div className="w-1/2">
													<Input
														name="account_number"
														label="Account Number"
														labelPlacement="outside"
														placeholder="Enter your account number"
														onValueChange={(value) => handleFormChange('pi', 'account_number', value)}
														value={paymentInfoForm.account_number}
													/>
												</div>
											</div>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="routing_number"
														label="Routing Number (USA)"
														placeholder="e.g. 026009593"
														description="9-digit routing number for U.S. bank transfers."
														onValueChange={(value) => handleFormChange('pi', 'routing_number', value)}
														value={paymentInfoForm.routing_number}
													/>
												</div>
												<div className="w-1/2">
													 <Input
														 name="iban"
															label="IBAN"
															placeholder="e.g. DE89 3704 0044 0532 0130 00"
															description="Your international bank account number for global transfers."
															onValueChange={(value) => handleFormChange('pi', 'iban', value)}
															value={paymentInfoForm.iban}
														/>
												</div>
											</div>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="swift_code"
														label="SWIFT / BIC Code"
														placeholder="e.g. CHASUS33 or BOFAUS3NXXX"
														description="Unique bank identifier required for international wire transfers."
														onValueChange={(value) => handleFormChange('pi', 'swift_code', value)}
														value={paymentInfoForm.swift_code}
													/>
												</div>

												<div className="w-1/2">
													 <Input
														name="paypal_email"
														label="PayPal Email"
														placeholder="e.g. billing@mybusiness.com"
														description="Your PayPal account email for receiving payments."
														onValueChange={(value) => handleFormChange('pi', 'paypal_email', value)}
														value={paymentInfoForm.paypal_email}
													/>

													{/*<Input*/}
													{/*	label="PayPal.me Link (Optional)"*/}
													{/*	placeholder="e.g. https://paypal.me/mybusiness"*/}
													{/*	description="Optional link for sending payments directly."*/}
													{/*/>*/}
												</div>
											</div>
											<div className="flex gap-4 py-4">
												<div className="w-1/2">
													<Input
														name="cash_app"
														label="Cash App Cashtag"
														placeholder="e.g. $edbedia or $mybusinessname"
														description="Your Cash App payment identifier. Cashtag starts with $. Email is optional."
														onValueChange={(value) => handleFormChange('pi', 'cash_app', value)}
														value={paymentInfoForm.cash_app}
													/>
												</div>
											</div>

											<div className="flex gap-4 py-4">
												<Button as={Link} href="/app/invoice/business-profile">Cancel</Button>
												<Button type="button" onPress={save} color="primary" variant="flat">Submit</Button>
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