"use client";

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button, DatePicker} from "@heroui/react";
import {Autocomplete, AutocompleteItem, Select, SelectItem, Checkbox} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {centsToDollarsStr, dollarsToCents} from "@/app/utils/computeInvoice";
import {toDateValue, toISO} from "@/app/utils/date";
import {uri} from "@/app/constants/routePaths";

const compactText = (...parts) => parts.filter(Boolean).join(" ");

const currencySearchText = (currency) =>
	compactText(currency?.code, currency?.name, currency?.symbol);

export default function InvoiceInfo({isIssuedOrPaid, isPaid}) {
	const {
		businessProfileData,
		clientData,
		data,
		onDataChange,
		setHasShipping,
		hasShipping,
		isTaxable,
		setIsTaxable,
		currencies,
		setSelectedCurrency,
		selectedCurrency,
	} = useInvoice()

	const enableShipping = () => {
		setHasShipping(true);
		if (data.shipping_cents == null || Number(data.shipping_cents) === 0) onDataChange("shipping_cents", 0);
		if (data.shipping_tax_rate == null) onDataChange("shipping_tax_rate", 0);
	};

	const disableShipping = () => {
		setHasShipping(false);
		setIsTaxable(false);
		onDataChange("shipping_address", "");
		onDataChange("shipping_cents", 0);
		onDataChange("shipping_tax_rate", 0);
	};

	const isAmount = data.discount_mode === "amount";
	const isPercent = data.discount_mode === "percent";
	const isPerLine = data.discount_mode === "per-line";
	const currencySymbol = selectedCurrency?.symbol ?? "";
	return (
		<Card className="mb-5 workspace-card invoice-info-card" fullWidth radius="sm">
			<CardHeader className="flex gap-3">
				<div>
					<h2>Create New Invoice</h2>
					<p className="text-sm text-default-500">Set invoice details, client, currency, and optional
						shipping.</p>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						{(businessProfileData || []).length > 0 ? (
							<Autocomplete
								isDisabled={isIssuedOrPaid}
								className="w-full"
								label="Select a Business Profile"
								labelPlacement="outside"
								placeholder="Search business profiles"
								selectedKey={data.business_profile_id ? String(data.business_profile_id) : null}
								onSelectionChange={(key) => onDataChange('business_profile_id', key ? String(key) : null)}>
								{businessProfileData && Object.keys(businessProfileData).length > 0 && businessProfileData.map(b =>
									<AutocompleteItem key={String(b.id)} textValue={b.name}>
										{b.name}
									</AutocompleteItem>
								)}
							</Autocomplete>
						) : (<Link href={uri.business_profile.create}>Create Business Profile</Link>)}
					</div>
					<div className="md:w-1/2">
						<Input
							isDisabled={isIssuedOrPaid}
							isRequired
							label="Invoice Number"
							description="(Eg: INV-00001 or MYCOMPANY-00001)"
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
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						<DatePicker
							isDisabled={isIssuedOrPaid}
							className="w-full"
							label="Issue date"
							labelPlacement="outside"
							granularity="day"
							value={toDateValue(data.issued_on)}
							onChange={(v) => onDataChange('issued_on', toISO(v))}
						/>
					</div>
					<div className="md:w-1/2">
						<DatePicker
							isDisabled={isIssuedOrPaid}
							className="w-full"
							labelPlacement="outside"
							label="Due Date"
							granularity="day"
							value={toDateValue(data.due_on)}
							onChange={(v) => onDataChange('due_on', toISO(v))}
						/>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						{(clientData || []).length > 0 ? (
							<Autocomplete
								isDisabled={isIssuedOrPaid}
								className="w-full"
								label="Your Client/Bill To"
								labelPlacement="outside"
								placeholder="Search clients"
								selectedKey={data.client_id ? String(data.client_id) : null}
								onSelectionChange={(key) => onDataChange('client_id', key ? String(key) : null)}>
								{clientData && Object.keys(clientData).length > 0 && clientData.map(b =>
									<AutocompleteItem key={String(b.id)} textValue={b.name}>
										{b.name}
									</AutocompleteItem>
								)}
							</Autocomplete>
						) : (<Link href={uri.client.create_client}>Create Client Profile</Link>)}
					</div>
					{!isIssuedOrPaid && (<div className="md:w-1/2 content-center">
						{!hasShipping
							? (<Link className="cursor-pointer" onPress={enableShipping}>Add Shipping</Link>)
							: (
								<>
									<Input
										errorMessage="Shipping / Delivery Address (optional)"
										labelPlacement="outside"
										label="Shipping Address"
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
									<br />
									<Input
										isRequired={hasShipping}
										errorMessage="Please enter a shipping fee"
										label="Enter a flat shipping amount."
										labelPlacement="outside"
										name="shipping_cents_display"
										placeholder="Enter Shipping Cost (e.g., 12.99)"
										type="number"
										variant="bordered"
										radius="sm"
										value={
											data.shipping_cents === null || data.shipping_cents === undefined
												? ""
												: centsToDollarsStr(data.shipping_cents)
										}
										onValueChange={(val) => {
											onDataChange("shipping_cents", val === "" ? 0 : dollarsToCents(val));
										}}
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
										Apply tax to shipping
									</Checkbox>

									{isTaxable && (
										<>
											<Input
												isRequired={hasShipping && isTaxable}
												errorMessage="Enter a tax rate like 8.25 for 8.25%"
												label="Enter Shipping Tax Rate (%)"
												labelPlacement="outside"
												name="shipping_tax_rate"
												type="number"
												variant="bordered"
												radius="sm"
												value={String(data.shipping_tax_rate ?? 0)}
												onValueChange={(val) =>
													onDataChange("shipping_tax_rate", parseFloat(val) || 0)
												}
												className="mb-3"
											/>
										</>
									)}
									<br/>
									<Link className="cursor-pointer" onPress={disableShipping}>Remove Shipping</Link>
								</>
							)}
					</div>)}
				</div>

				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						<Autocomplete
							isDisabled={isIssuedOrPaid}
							className="w-full"
							label="Select a currency"
							labelPlacement="outside-top"
							placeholder="Search currencies"
							isClearable={false}
							selectedKey={String(data.currency_id ?? 1)}
							onSelectionChange={(key) => {
								if (!key) return;
								const id = String(key);
								onDataChange('currency_id', Number(id));
								setSelectedCurrency((currencies.filter(f => parseInt(f.id) === parseInt(id))[0] || {}))
							}}
						>
							{currencies && Object.keys(currencies).length > 0 && currencies.map(c => (
								<AutocompleteItem
									key={String(c.id)}
									textValue={currencySearchText(c)}
								>
									<div className="flex items-center gap-2">
										<span className="font-medium">{c.code}</span>
										<span className="text-default-500">— {c.name}</span>
										<span className="ml-auto">{c.symbol}</span>
									</div>
								</AutocompleteItem>
							))}
						</Autocomplete>
					</div>
					<div className="md:w-1/2">
						<Textarea
							isDisabled={isPaid}
							label="Note"
							labelPlacement="outside"
							name="notes"
							placeholder="Add a Note"
							type="text"
							variant="bordered"
							radius="sm"
							value={data.notes}
							onValueChange={(val) => onDataChange('notes', val)}
						/>
					</div>
				</div>

				{/* NEW: Discount Mode + Inputs */}
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						<Select
							isDisabled={isIssuedOrPaid}
							className="w-full"
							labelPlacement="outside"
							label="Select Discount Mode"
							selectionMode="single"
							selectedKeys={new Set([data.discount_mode || 'none'])}
							onSelectionChange={(keys) => {
								const mode = Array.from(keys)[0] ?? 'none';
								onDataChange('discount_mode', mode);// No automatic resets here; user can keep their typed value.// Calculator will ignore irrelevant fields per mode.
							}}
						>
							<SelectItem key="none">None</SelectItem>
							<SelectItem key="amount">Invoice-level (Amount)</SelectItem>
							<SelectItem key="percent">Invoice-level (Percent)</SelectItem>
							<SelectItem key="per-line">Per-line discounts</SelectItem>
						</Select>

						{/* If per-line: nothing here; fields will show inside each item row */}
						{isPerLine && (
							<div className="md:w-1/2 pl-2"><small className="text-default-500">Per-line discounts are
								enabled. Each item can set a discount in dollars or percent.</small></div>)}

						{/* Invoice-level fields (amount/percent) */}
						{isAmount && (
							<div className="md:w-1/2 pl-2">Discount Amount ({currencySymbol})<Input isDisabled={isIssuedOrPaid} type="number" variant="bordered"
																					 radius="sm"
																					 value={centsToDollarsStr(data.discount_cents ?? 0)}
																					 onValueChange={(val) => onDataChange('discount_cents', dollarsToCents(val))}/>
							</div>)}
						{isPercent && (
							<div className="md:w-1/2 pl-2">Discount Percent (%)<Input isDisabled={isIssuedOrPaid} type="number" variant="bordered"
																					  radius="sm"
																					  value={String(data.discount_rate ?? 0)}
																					  onValueChange={(val) => onDataChange('discount_rate', parseFloat(val) || 0)}/>
							</div>)}
					</div>
					<div className="md:w-1/2">
						<Textarea
							isDisabled={isPaid}
							label="Terms"
							labelPlacement="outside"
							name="terms"
							placeholder="Add a Term"
							type="text"
							variant="bordered"
							radius="sm"
							value={data.terms}
							onValueChange={(val) => onDataChange('terms', val)}
						/>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">

				</div>

			</CardBody>
		</Card>
	)
}
