"use client";

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button, DatePicker} from "@heroui/react";
import {Select, SelectItem, Checkbox} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {centsToDollarsStr, dollarsToCents} from "@/app/utils/computeInvoice";
import {toDateValue, toISO} from "@/app/utils/date";
import {uri} from "@/app/constants/routePaths";

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
						Business Profile <br/>
						{(businessProfileData || []).length > 0 ? (
							<Select
								isDisabled={isIssuedOrPaid}
								className="max-w-xs"
								label="Select a Business Profile"
								selectionMode="single"
								selectedKeys={data.business_profile_id ? new Set([String(data.business_profile_id)]) : new Set()}
								onSelectionChange={(keys) => onDataChange('business_profile_id', Array.from(keys)[0] ?? null)}>
								{businessProfileData && Object.keys(businessProfileData).length > 0 && businessProfileData.map(b =>
									<SelectItem key={b.id}>{b.name}</SelectItem>
								)}
							</Select>
						) : (<Link href={uri.business_profile.create}>Create Business Profile</Link>)}
					</div>
					<div className="md:w-1/2">
						Invoice Number <i>(Eg: INV-00001 or MYCOMPANY-00001)</i> <br/>
						<Input
							isDisabled={isIssuedOrPaid}
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
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						Issue Date<br/>
						<DatePicker
							isDisabled={isIssuedOrPaid}
							className="max-w-[284px]"
							label="Issue date"
							granularity="day"
							value={toDateValue(data.issued_on)}
							onChange={(v) => onDataChange('issued_on', toISO(v))}
						/>
					</div>
					<div className="md:w-1/2">
						Due Date<br/>
						<DatePicker
							isDisabled={isIssuedOrPaid}
							className="max-w-[284px]"
							label="Due date"
							granularity="day"
							value={toDateValue(data.due_on)}
							onChange={(v) => onDataChange('due_on', toISO(v))}
						/>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						Your Client/Bill To<br/>
						{(clientData || []).length > 0 ? (
							<Select
								isDisabled={isIssuedOrPaid}
								className="max-w-xs"
								label="Select a Client"
								selectionMode="single"
								selectedKeys={
									data.client_id ? new Set([String(data.client_id)]) : new Set()
								}
								onSelectionChange={(keys) => onDataChange('client_id', Array.from(keys)[0] ?? null)}>
								{clientData && Object.keys(clientData).length > 0 && clientData.map(b =>
									<SelectItem key={b.id}>{b.name}</SelectItem>
								)}
							</Select>
						) : (<Link href={uri.client.create_client}>Create Client Profile</Link>)}
					</div>
					{!isIssuedOrPaid && (<div className="md:w-1/2 content-center">
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
										<>
											<br/>
											Enter Shipping Tax Rate (%)<br/>
											<Input
												isRequired={hasShipping && isTaxable}
												errorMessage="Enter a tax rate like 8.25 for 8.25%"
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
									<Link onPress={disableShipping}>Remove Shipping</Link>
								</>
							)}
					</div>)}
				</div>

				<div className="flex flex-col md:flex-row gap-2 py-2 invoice-info-row">
					<div className="md:w-1/2">
						<Select
							isDisabled={isIssuedOrPaid}
							className="max-w-xs"
							label="Select a currency"
							selectionMode="single"
							selectedKeys={new Set([String(data.currency_id ?? 1)])}
							onSelectionChange={(val) => {
								const id = Array.from(val)[0];
								onDataChange('currency_id', Number(id));
								setSelectedCurrency((currencies.filter(f => parseInt(f.id) === parseInt(id))[0] || {}))
							}}
						>
							{currencies && Object.keys(currencies).length > 0 && currencies.map(c => (
								<SelectItem
									key={String(c.id)}
									textValue={`${c.code} — ${c.name}`}
								>
									<div className="flex items-center gap-2">
										<span className="font-medium">{c.code}</span>
										<span className="text-default-500">— {c.name}</span>
										<span className="ml-auto">{c.symbol}</span>
									</div>
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="md:w-1/2">Note:<br/>
						<Textarea
							isDisabled={isPaid}
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
					<div className="md:w-1/2">Discount Mode<br/>
						<Select
							isDisabled={isIssuedOrPaid}
							className="max-w-xs"
							label="Select discount mode"
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
						Terms:<br/>
						<Textarea
							isDisabled={isPaid}
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
