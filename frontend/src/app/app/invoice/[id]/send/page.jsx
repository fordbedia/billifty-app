"use client";

import React, {use} from "react";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";
import RootLayout from "@/app/components/common/RootLayout";
import {Button, Checkbox, Link, Switch} from "@heroui/react";
import {Divider} from "@heroui/divider";
import Tiptap from "@/app/components/wysiwyg/TipTap";
import {useInvoice} from "@/app/providers/InvoiceContext";
import InvoicePreviewPage from "@/app/app/invoice/components/InvoicePreviewPage";
import {uri} from "@/app/constants/routePaths";
import NotFound from "@/app/app/invoice/components/errorPages/NotFound";
import BSpinner from "@/app/components/Spinner";
import CongratsScreen from "@/app/app/invoice/[id]/send/CongratsScreen";

const EXPORT_OPTIONS = [
	{
		value: "downloadPdf",
		title: "Download Now",
		description: "Download the PDF directly to your device",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.6}
				stroke="currentColor"
				className="size-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
				/>
			</svg>
		),
	},
	{
		value: "sendCopyToMe",
		title: "Send copy to my mail",
		description: "Receive a copy of the invoice in your email inbox",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.6}
				stroke="currentColor"
				className="size-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
				/>
			</svg>
		),
	},
	{
		value: "directSendToClient",
		title: "Send directly to client",
		description: "Send the invoice directly to your client's email address",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.6}
				stroke="currentColor"
				className="size-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="m3.75 12 16.5-7.5-5.25 15-3-6-6-1.5Z"
				/>
			</svg>
		),
	},
];

const footerActionButtonClass =
	"group h-auto min-h-[54px] rounded-[8px] px-5 py-3 text-base font-semibold tracking-normal transition-all duration-300 ease-out sm:px-6";

const footerPrimaryButtonClass = [
	footerActionButtonClass,
	"bg-[#1d84c6] text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)]",
	"hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)]",
	"focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2",
].join(" ");

const footerSecondaryButtonClass = [
	footerActionButtonClass,
	"border-[#c9ddec] bg-white text-[#28516d]",
	"shadow-[0_10px_24px_-22px_rgba(34,74,104,0.65)]",
	"hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad] hover:shadow-[0_18px_34px_-26px_rgba(34,115,174,0.8)]",
	"focus-visible:ring-2 focus-visible:ring-[#9bd0ef] focus-visible:ring-offset-2",
].join(" ");

function Main({initialId}) {
	const {
		isInvoiceError,
		isLoadingInvoice,
		onOpenPreviewInvoiceModal,
		exportOption,
		setExportOption,
		generatePdf,
		data,
		sendCopyToMyEmail,
		exportMessage,
		setExportMessage,
		sendToClient,
		hasCsvReport,
		setHasCsvReport,
		paymentRemindersEnabled, setPaymentRemindersEnabled, setPaymentReminder
	} = useInvoice();

	// ----------------------------------------------------------------------------
	// Only directly update the invoices.payment_reminders_enabled if user has already set a reminder
	// Otherwise, just change the state and let the "Send Directly to Client" logic do everything
	// Including the invoices.payment_reminders_enabled
	// ----------------------------------------------------------------------------
	const hasExistingReminderSchedule = Boolean(
		data?.invoice_reminder_schedule_id ||
		data?.reminderSchedule ||
		data?.reminder_schedule
	);
	const reminderSwitchSelected = hasExistingReminderSchedule
		? Boolean(data?.payment_reminders_enabled)
		: paymentRemindersEnabled;
	const isVoidInvoice = data?.status === 'void';
	const exportOptions = isVoidInvoice
		? EXPORT_OPTIONS.filter((opt) => opt.value !== "directSendToClient")
		: EXPORT_OPTIONS;

	const handlePaymentReminderChange = (enabled) => {
		if (hasExistingReminderSchedule) {
			setPaymentReminder(enabled);
			return;
		}

		setPaymentRemindersEnabled(enabled);
	};

	const handleSelect = (value) => {
		setExportOption((prev) => ({
			...prev,
			selectedOption: value,
		}));
	};

	const Buttons = () => {
		let button = null;

		if (exportOption?.selectedOption === "downloadPdf") {
			button = (
				<Button
					onPress={generatePdf}
					variant="flat"
					disableRipple
					className={footerPrimaryButtonClass}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 transition-transform duration-300 group-hover:translate-y-0.5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
						/>
					</svg>
					Export PDF
				</Button>
			);
		} else if (exportOption?.selectedOption === "sendCopyToMe") {
			button = (
				<Button
					onPress={sendCopyToMyEmail}
					variant="flat"
					disableRipple
					className={footerPrimaryButtonClass}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
						/>
					</svg>
					Send Copy to Email
				</Button>
			);
		} else if (exportOption?.selectedOption === "directSendToClient" && !isVoidInvoice) {
			button = (
				<Button
					onPress={() => sendToClient({
						payment_reminders_enabled: reminderSwitchSelected,
					})}
					variant="flat"
					disableRipple
					className={footerPrimaryButtonClass}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
						/>
					</svg>
					Send Directly to Client
				</Button>
			);
		}

		return exportOption?.selectedOption !== "" && button;
	};

	const Body = () => (
		<>
			<InvoicePreviewPage invoiceId={initialId}/>
			<div className="app app-wrapper min-h-screen bg-[#f6f7f9]">
				<div className="mx-auto w-full max-w-[840px] px-4 pb-14 pt-10 sm:px-6 sm:pt-12 lg:pt-14">
					<div className="mb-9 text-center sm:mb-10">
						<h1 className="text-[30px] font-semibold leading-tight tracking-normal text-[#111827] sm:text-[34px]">
							Delivery Options
						</h1>
						<p className="mt-3 text-[15px] font-normal leading-6 tracking-normal text-[#687384] sm:text-base">
							Select how you want to deliver your invoice
						</p>
					</div>

					<div className="w-full">
						<fieldset className="mx-auto w-full">
							<legend className="sr-only">
								Select how you want to deliver your invoice
							</legend>

							<div className="grid gap-4">
								{exportOptions.map((opt) => {
									const selected = exportOption.selectedOption === opt.value;

									return (
										<label
											key={opt.value}
											className={[
												"group relative flex min-h-[92px] cursor-pointer items-center rounded-[14px] border px-5 py-5",
												"bg-white shadow-[0_8px_24px_-22px_rgba(15,23,42,0.55)]",
												"transition-all duration-200 ease-out",
												"hover:border-[#b7d9f3] hover:bg-[#f8fbff] hover:shadow-[0_14px_34px_-26px_rgba(45,110,169,0.42)]",
												"focus-within:ring-2 focus-within:ring-[#8cc8ef] focus-within:ring-offset-2",
												"sm:min-h-[104px] sm:px-7",
												selected
													? "border-[#a6d3f3] bg-[#edf7ff] shadow-[0_14px_34px_-24px_rgba(47,128,194,0.45)]"
													: "border-[#e3e8ef]",
											].join(" ")}
										>
											<input
												type="radio"
												name="exportOption"
												value={opt.value}
												className="sr-only"
												checked={selected}
												onChange={() => handleSelect(opt.value)}
											/>

											<div className="flex w-full items-center gap-5 pr-11">
												<div
													className={[
														"flex size-11 shrink-0 items-center justify-center rounded-full border bg-[#fbfdff] transition-colors duration-200",
														selected
															? "border-[#d7ebfb] text-[#2f80d6] shadow-[0_8px_18px_-16px_rgba(47,128,214,0.8)]"
															: "border-[#edf1f5] text-[#6b7787]",
													].join(" ")}
												>
													{opt.icon}
												</div>
												<div className="min-w-0">
													<h2
														className={[
															"text-base font-semibold leading-6 tracking-normal transition-colors duration-200",
															selected ? "text-[#111827]" : "text-[#1f2937]",
														].join(" ")}
													>
														{opt.title}
													</h2>
													<p className="text-sm font-normal leading-5 tracking-normal text-[#687384] sm:text-[15px]">
														{opt.description}
													</p>
												</div>
											</div>

											<span
												aria-hidden="true"
												className={[
													"pointer-events-none absolute right-7 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 sm:right-8",
													selected
														? "border-[#3c86e5] bg-[#3c86e5] shadow-[0_0_0_4px_rgba(60,134,229,0.10)]"
														: "border-[#d7dee8] bg-white group-hover:border-[#9bc8ec]",
												].join(" ")}
											>
                        <span
							className={[
								"h-[7px] w-[7px] rounded-full bg-white transition-transform duration-300",
								selected ? "scale-100" : "scale-0",
							].join(" ")}
						/>
                      </span>
										</label>
									);
								})}
							</div>
						</fieldset>
					</div>

					<div className="mx-auto mt-9 w-full"></div>

					{exportOption &&
						Object.keys(exportOption).length > 0 &&
						exportOption?.selectedOption === "directSendToClient" &&
						!isVoidInvoice && (
							<div className="mx-auto w-full space-y-6">
								{data?.due_on && data?.status === 'issued' && (
									<section
										className="rounded-[14px] border border-[#e1e7ef] bg-white p-6 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.48)] sm:p-7">
										<div className="flex items-start justify-between gap-4">
											<div>
												<h2 className="text-base font-semibold leading-6 text-[#1f2937]">
													Automatic Payment Reminders
												</h2>
												<p className="mt-2 max-w-[640px] text-sm leading-6 text-[#687384] sm:text-[15px]">
													Billifty can send polite reminders before and after the
													due date. Reminders stop automatically once the invoice
													is marked as paid.
												</p>
											</div>
											<Switch
												aria-label="Automatic payment reminders"
												color="primary"
												size="sm"
												isSelected={reminderSwitchSelected}
												onValueChange={handlePaymentReminderChange}
												className="shrink-0"
											/>
										</div>

										<div
											className="mt-6 rounded-[10px] border border-[#eef2f6] bg-[#f8fafc] px-5 py-4 text-sm font-medium leading-5 text-[#405064]">
											<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.6}
													stroke="currentColor"
													className="size-4 text-[#7b8da1]"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25A1.5 1.5 0 0 1 3.75 18.75v-12A1.5 1.5 0 0 1 5.25 5.25Z"
													/>
												</svg>
												<span>3 days before due date</span>
												<span className="text-[#c2cad4]">·</span>
												<span>On due date</span>
												<span className="text-[#c2cad4]">·</span>
												<span>3 days after</span>
												<span className="text-[#c2cad4]">·</span>
												<span>7 days after</span>
											</div>
										</div>

										<p className="mt-4 flex items-start gap-2 text-[13px] leading-5 text-[#8a98aa]">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.7}
												stroke="currentColor"
												className="mt-0.5 size-3.5 shrink-0"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
												/>
											</svg>
											Available when the invoice has a due date and is sent
											directly to the client.
										</p>
									</section>
								)}

								<Tiptap
									initialValue={exportMessage}
									onCommit={setExportMessage}
								/>
							</div>
						)}

					{exportOption &&
						Object.keys(exportOption).length > 0 &&
						exportOption?.selectedOption === "sendCopyToMe" && (
							<div className="mx-auto flex w-full flex-col gap-3">
								<Checkbox
									color="primary"
									isSelected={hasCsvReport}
									onValueChange={setHasCsvReport}
								>
									Include a CSV report for this invoice
								</Checkbox>
							</div>
						)}

					<div className="mx-auto mt-10 w-full">
						<Divider/>

						<div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
							<div>
								<Link
									className="text-lg font-medium text-[#242424]"
									href={uri.invoice(initialId)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
										/>
									</svg>
									&nbsp;Back to Invoice
								</Link>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<Button
									variant="bordered"
									onPress={onOpenPreviewInvoiceModal}
									disableRipple
									className={footerSecondaryButtonClass}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-5 transition-transform duration-300 group-hover:scale-110"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
									Preview PDF
								</Button>
								<Buttons/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);

	const Component = () => {
		if (typeof isLoadingInvoice !== undefined && isLoadingInvoice) {
			return <BSpinner/>;
		}

		if (isInvoiceError) {
			return <NotFound/>;
		}

		if (exportOption.status === "done") {
			return (
				<CongratsScreen
					invoice={data}
					options={exportOption}
					footer={
						<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
							<Button
								as={Link}
								href={uri.create_invoice}
								disableRipple
								className={footerPrimaryButtonClass}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-5 transition-transform duration-300 group-hover:rotate-90"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									/>
								</svg>
								Create New Invoice
							</Button>
							<Button
								onPress={() =>
									setExportOption((prev) => ({
										...prev,
										selectedOption: "",
										status: null,
									}))
								}
								disableRipple
								className={footerSecondaryButtonClass}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-5 transition-transform duration-300 group-hover:translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
									/>
								</svg>
								Re-Export PDF
							</Button>
						</div>
					}
				/>
			);
		}

		return <Body/>;
	};

	return (
		<RootLayout>
			<Component/>
		</RootLayout>
	);
}

export default function App({params}) {
	const resolveParams = use(params);
	return (
		<InvoiceProvider initialId={resolveParams?.id} mode="send">
			<Main initialId={resolveParams?.id}/>
		</InvoiceProvider>
	);
}
