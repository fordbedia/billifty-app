"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Card, CardBody, CardHeader, Form, Button, Input, Select, SelectItem, Link, Alert} from "@heroui/react";
import {useRef, useState} from "react";
import {useBusinessProfile} from "@/app/providers/BusinessProfileContext";
import ConfirmDelete from "@/app/app/invoice/business-profile/modals/ConfirmDelete";
import NotFound from "@/app/app/invoice/components/errorPages/NotFound";
import BSpinner from "@/app/components/Spinner";
import {useApp} from "@/app/providers/AppContext";

const formPrimaryButtonClass =
	"group h-auto min-h-[30px] rounded-[8px] bg-[#1d84c6] px-6 py-2 text-sm font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

const formSecondaryButtonClass =
	"h-auto min-h-[30px] rounded-[8px] border border-[#c9ddec] bg-white px-6 py-2 text-sm font-semibold tracking-normal text-[#28516d] shadow-[0_10px_24px_-22px_rgba(34,74,104,0.65)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad]";

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
		mode,
		save,
		errors,
		isOpenConfirmDeleteModal,
		onOpenConfirmDeleteModal,
		onOpenChangeConfirmDeleteModal,
		isError,
		isLoading,
	} = useBusinessProfile()

	const {
		planCapabilities
	} = useApp();

	if (isLoading) {
		 return (
			 <BSpinner />
		 );
	}

	if (isError) {
		return (
			<RootLayout>
				<NotFound />
			</RootLayout>
		)
	}
	return (
		<RootLayout>
			<ConfirmDelete />
			 <div className="app app-wrapper min-h-screen bg-white form-page">
			 <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 sm:pt-12 lg:pt-16">
          <div className="w-full mb-5">
						<div className="mx-auto max-w-[760px] text-center form-page-hero">
							<p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">Business Identity Setup</p>
							<h2 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[54px]">Set Up Your Business Profile</h2>
							<h3 className="mt-4 text-lg font-light leading-7 text-[#4e4e4e]">Add your business information and payment details to keep every invoice professional and consistent.</h3>
						</div>

						 <Card className="mt-9 border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)] form-card" fullWidth radius="sm">
                <CardBody className="px-5 py-6 sm:px-7">
									<Form className="w-full modern-form">
									{planCapabilities.allowed?.logo_upload && (
										<div className="mb-8 rounded-[8px] border border-[#dbe7f3] bg-[#f8fbfe] p-5">
											<h2 className="pb-3 text-xl font-semibold text-[#24323f]">Business Logo</h2>
											<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
												{/* Logo preview / placeholder */}
												<button
													type="button"
													onClick={handleClick}
													className="
														flex items-center justify-center
														w-24 h-24
														rounded-[8px]
														border-2 border-dashed border-[#CCD3DD]
														bg-[#F9FBFF]
														text-[#9AA3B5]
														hover:border-[#57B9FF]
														transition-all hover:-translate-y-0.5
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
														radius="sm"
														className={formPrimaryButtonClass}
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
									)}

										<div className="w-full">
											<h2 className="border-b border-[#e7edf4] pb-4 text-xl font-semibold text-[#24323f]">Business Information</h2>
											<div className="mt-6 grid gap-4 md:grid-cols-2">
												<div className="w-full">
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
												<div className="w-full">
													<Input
														isRequired
														name="legal_name"
														label="Legal Name (“Registered Business Name”) "
														labelPlacement="outside"
														placeholder="Enter your Legal Name"
														onValueChange={(value) => handleFormChange('bp', 'legal_name', value)}
														value={businessProfileForm.legal_name ?? ''}
													/>
												</div>
											</div>

											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="tax_id"
														label="Tax ID (Optional)"
  													placeholder="e.g. EIN: 12-3456789, TIN: 123-456-789-000, VAT: GB123456789"
														labelPlacement="outside"
														description="Used for tax and business compliance. Leave blank if you don't have one."
														onValueChange={(value) => handleFormChange('bp', 'tax_id', value)}
														value={businessProfileForm.tax_id ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="license_no"
														placeholder="e.g. Contractor License: TX-098765 or PRC: 1234567"
														description="Only required for certain professions. Leave blank if not applicable."
														labelPlacement="outside"
														label="Business or Professional License No. (Optional)"
														onValueChange={(value) => handleFormChange('bp', 'license_no', value)}
														value={businessProfileForm.license_no ?? ''}
													/>
												</div>
											</div>

											<h2 className="mt-8 border-b border-[#e7edf4] pb-4 text-xl font-semibold text-[#24323f]">Contact Information</h2>
											<div className="mt-6 grid gap-4 md:grid-cols-2">
												<div className="w-full">
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
												<div className="w-full">
													<Input
														name="phone"
														label="Phone Number"
														labelPlacement="outside"
														placeholder="(555) 123-4567"
														onValueChange={(value) => handleFormChange('bp', 'phone', value)}
														value={businessProfileForm.phone ?? ''}
													/>
												</div>
											</div>

											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="address_line1"
														label="Address 1"
														labelPlacement="outside"
														placeholder="Enter your address 1"
														onValueChange={(value) => handleFormChange('bp', 'address_line1', value)}
														value={businessProfileForm.address_line1 ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="address_line2"
														label="Address 2"
														labelPlacement="outside"
														placeholder="Enter your address 2"
														onValueChange={(value) => handleFormChange('bp', 'address_line2', value)}
														value={businessProfileForm.address_line2 ?? ''}
													/>
												</div>
											</div>

											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="city"
														label="City"
														labelPlacement="outside"
														placeholder="Enter your city"
														onValueChange={(value) => handleFormChange('bp', 'city', value)}
														value={businessProfileForm.city ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="state"
														label="State"
														labelPlacement="outside"
														placeholder="Enter your state"
														onValueChange={(value) => handleFormChange('bp', 'state', value)}
														value={businessProfileForm.state ?? ''}
													/>
												</div>
											</div>

											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="postal_code"
														label="ZIP/Postal Code"
														labelPlacement="outside"
														placeholder="10001"
														onValueChange={(value) => handleFormChange('bp', 'postal_code', value)}
														value={businessProfileForm.postal_code ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="country"
														label="Country"
														labelPlacement="outside"
														placeholder="Enter your country"
														onValueChange={(value) => handleFormChange('bp', 'country', value)}
														value={businessProfileForm.country ?? ''}
													/>
												</div>
											</div>

											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="website"
														label="Website"
														labelPlacement="outside"
														placeholder="Enter website"
														onValueChange={(value) => handleFormChange('bp', 'website', value)}
														value={businessProfileForm.website ?? ''}
													/>
												</div>
											</div>
											<h2 className="mt-8 border-b border-[#e7edf4] pb-4 text-xl font-semibold text-[#24323f]">Payment Information</h2>
											<div className="mt-6 grid gap-4 md:grid-cols-2">
												<div className="w-full">
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
												<div className="w-full">
													<Input
														name="bank_name"
														label="Bank Name"
														labelPlacement="outside"
														placeholder="Enter your bank name"
														onValueChange={(value) => handleFormChange('pi', 'bank_name', value)}
														value={paymentInfoForm.bank_name ?? ''}
													/>
												</div>
											</div>
											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													 <Input
														name="account_name"
														label="Account Holder Name"
														placeholder="e.g. Ed Bedia or EHD Enterprise LLC"
														description="Name registered with your bank."
														onValueChange={(value) => handleFormChange('pi', 'account_name', value)}
														value={paymentInfoForm.account_name ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="account_number"
														label="Account Number"
														labelPlacement="outside"
														placeholder="Enter your account number"
														onValueChange={(value) => handleFormChange('pi', 'account_number', value)}
														value={paymentInfoForm.account_number ?? ''}
													/>
												</div>
											</div>
											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="routing_number"
														label="Routing Number (USA)"
														placeholder="e.g. 026009593"
														description="9-digit routing number for U.S. bank transfers."
														onValueChange={(value) => handleFormChange('pi', 'routing_number', value)}
														value={paymentInfoForm.routing_number ?? ''}
													/>
												</div>
												<div className="w-full">
													 <Input
														 name="iban"
															label="IBAN"
															placeholder="e.g. DE89 3704 0044 0532 0130 00"
															description="Your international bank account number for global transfers."
															onValueChange={(value) => handleFormChange('pi', 'iban', value)}
															value={paymentInfoForm.iban ?? ''}
														/>
												</div>
											</div>
											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="swift_code"
														label="SWIFT / BIC Code"
														placeholder="e.g. CHASUS33 or BOFAUS3NXXX"
														description="Unique bank identifier required for international wire transfers."
														onValueChange={(value) => handleFormChange('pi', 'swift_code', value)}
														value={paymentInfoForm.swift_code ?? ''}
													/>
												</div>

												<div className="w-full">
													 <Input
														name="paypal_email"
														label="PayPal Email"
														placeholder="e.g. billing@mybusiness.com"
														description="Your PayPal account email for receiving payments."
														onValueChange={(value) => handleFormChange('pi', 'paypal_email', value)}
														value={paymentInfoForm.paypal_email ?? ''}
													/>

													{/*<Input*/}
													{/*	label="PayPal.me Link (Optional)"*/}
													{/*	placeholder="e.g. https://paypal.me/mybusiness"*/}
													{/*	description="Optional link for sending payments directly."*/}
													{/*/>*/}
												</div>
											</div>
											<div className="mt-4 grid gap-4 md:grid-cols-2">
												<div className="w-full">
													<Input
														name="cash_app"
														label="Cash App Cashtag"
														placeholder="e.g. $edbedia or $mybusinessname"
														description="Your Cash App payment identifier. Cashtag starts with $. Email is optional."
														onValueChange={(value) => handleFormChange('pi', 'cash_app', value)}
														value={paymentInfoForm.cash_app ?? ''}
													/>
												</div>
												<div className="w-full">
													<Input
														name="stripe_account_id"
														label="Stripe Account ID"
														description="Paste your Stripe Account ID."
														placeholder=""
														onValueChange={(value) => handleFormChange('pi', 'stripe_account_id', value)}
														value={paymentInfoForm.stripe_account_id ?? ''}
													/>
												</div>
											</div>

											<div className="errors">
												{typeof errors !== 'string' && typeof errors !== undefined && errors && Object.keys(errors).length > 0 && (
													<Alert color="danger">
														<ul>
															{errors?.map((v, k) => (<li key={k}>{v}</li>))}
														</ul>
													</Alert>
												)}

												{typeof errors === 'string' && typeof errors !== undefined && errors && (
													<Alert color="danger">
														{errors}
													</Alert>
												)}
											</div>

											<div className="mt-8 flex flex-col gap-4 border-t border-[#e7edf4] pt-5 sm:flex-row sm:items-center sm:justify-between">
												<div className="flex flex-col gap-3 sm:flex-row">
													<Button className={formSecondaryButtonClass} as={Link} href="/app/invoice/business-profile">{mode === 'new' ? 'Cancel' : 'Back'}</Button>
													<Button className={formPrimaryButtonClass} type="button" onPress={save} variant="flat">{mode === 'new' ? 'Submit' : 'Save Changes'}</Button>
												</div>
												<div>
													{mode === 'edit' && businessProfileForm?.id && (<Button className="h-auto min-h-[30px] rounded-[8px] px-6 py-2 text-sm font-semibold" color="danger" onPress={onOpenConfirmDeleteModal}>
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
			 </div>
		</RootLayout>
	)
}
