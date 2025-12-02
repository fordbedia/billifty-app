"use client"

import {use} from "react";
import Layout from "@/app/app/invoice/Layout";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";
import RootLayout from "@/app/components/common/RootLayout";
import Image from "next/image";
import {Button, Card, CardBody, CardFooter, CardHeader, Link, Radio, RadioGroup} from "@heroui/react";
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
    title: "Download PDF",
    description: "Download the PDF directly to your device",
    icon: (
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
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
  },
  {
    value: "sendCopyToMe",
    title: "Send copy to my email",
    description: "Receive a copy of the invoice in your email inbox",
    icon: (
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
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
        />
      </svg>
    ),
  },
];

function Main({initialId}) {
	const {
		isInvoiceError, isLoadingInvoice,
		onOpenPreviewInvoiceModal,
		exportOption, setExportOption,
		generatePdf,
		data,
	} = useInvoice()

	 const handleSelect = (value) => {
			setExportOption((prev) => ({
				...prev,
				selectedOption: value,
			}));
		};

	const Buttons = () => {
		let button = '';
		if (exportOption?.selectedOption === 'downloadPdf') {
			button = (
				<Button onPress={generatePdf} variant="flat" disableRipple className="py-6 px-5 text-lg font-medium ml-2 bg-black text-white">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
					</svg>
					Export PDF
				</Button>
			)
		} else if (exportOption?.selectedOption === 'sendCopyToMe') {
			button = (
				<Button variant="flat" disableRipple className="py-6 px-5 text-lg font-medium ml-2 bg-black text-white">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
					</svg>
					Send Copy to Email
				</Button>
			)
		} else if (exportOption?.selectedOption === 'directSendToClient') {
			button = (
				<Button variant="flat" disableRipple className="py-6 px-5 text-lg font-medium ml-2 bg-black text-white">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
					</svg>
					Send Directly to Client
				</Button>
			)
		}

		return exportOption?.selectedOption !== "" && (
			button
		)
	}

	const Body = () => (
		<>
			<InvoicePreviewPage invoiceId={initialId} />
				<div className="app app-wrapper outer-bg">
					<div className="m-auto max-w-screen-xl py-5">
          	<div className="w-full mb-5">
							<div className="mt-5 flex justify-center items-center flex-wrap flex-col gap-4">
								<Image width="64" height="64" quality={100} priority src="/images/pdf-icon-b.png" alt="PDF Icon" />
								<h3 className="text-4xl font-bold">PDF Export Options</h3>
								<p className="text-xl font-thin">Customize your PDF export settings and choose how you'd like to share your invoice.</p>
							</div>

							<Card className="export-pdf mt-7">
								<CardBody className="mx-7 py-8">
									<h3 className="text-2xl font-bold">Delivery Options</h3>
									<div className="w-full">
										 <fieldset className="space-y-3">
											<legend className="mb-2 text-sm font-medium text-foreground">
												Select options for delivery of your invoice
											</legend>

											<div className="grid gap-3 max-w-screen-lg">
												{EXPORT_OPTIONS.map((opt) => {
													const selected = exportOption.selectedOption === opt.value;

													return (
														<label
															key={opt.value}
															className={[
																"relative flex cursor-pointer flex-col rounded-xl border px-4 py-3",
																"transition-all duration-150",
																// base colors
																"bg-content1/60 border-default-200",
																// hover glow
																"hover:border-foreground hover:shadow-md",
																// focus-visible from the hidden input
																"focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-1",
																// selected state
																selected
																	? "border-foreground bg-content2 shadow-md"
																	: "border-default-200",
															].join(" ")}
														>
															{/* Native radio input for accessibility */}
															<input
																type="radio"
																name="exportOption"
																value={opt.value}
																className="sr-only"
																checked={selected}
																onChange={() => handleSelect(opt.value)}
															/>

															<div className="flex items-start gap-3">
																<div className="mt-0.5 shrink-0 text-foreground">
																	{opt.icon}
																</div>
																<div>
																	<h2 className="flex items-center gap-2 pb-1 text-base font-semibold">
																		{opt.title}
																	</h2>
																	<p className="text-sm font-light text-foreground/80">
																		{opt.description}
																	</p>
																</div>
															</div>

															{/* Optional subtle selected indicator dot */}
															<span
																aria-hidden="true"
																className={[
																	"pointer-events-none absolute right-4 top-4 h-2.5 w-2.5 rounded-full border",
																	selected
																		? "border-foreground bg-foreground"
																		: "border-default-300 bg-transparent",
																].join(" ")}
															/>
														</label>
													);
												})}
											</div>
										</fieldset>
									</div>
									{exportOption && Object.keys(exportOption).length > 0 && exportOption?.selectedOption === 'directSendToClient' && (
										<div className="box">
											<Tiptap
												onChange={(v) => setExportOption(prev => ({...prev, payload: {...prev.payload, message: v}}))}
												value={exportOption.payload.message} />
										</div>
									)}

								</CardBody>
								<CardFooter>
									<div className="w-full mx-7">
										<Divider />

										<div className="flex justify-between items-center mt-5 gap-4">
											<div>
												<Link className="text-lg font-medium" href={uri.invoice(initialId)}>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
														<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
													</svg>
													 &nbsp;Back to Invoice</Link>
											</div>
											<div className="">
												<Button variant="bordered" onPress={onOpenPreviewInvoiceModal} disableRipple className="py-6 px-5 text-lg font-medium ml-2">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
															<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
															<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
														</svg>
													Preview PDF</Button>
													<Buttons />
											</div>
										</div>
									</div>
								</CardFooter>
							</Card>

						</div>
					</div>
				</div>
		</>
	)

	const Component = () => {
		if (typeof isLoadingInvoice !== undefined && isLoadingInvoice) {
			return <BSpinner />
		}

		if (isInvoiceError) {
			return <NotFound />
		}

		if (exportOption.status === 'done') {
			return <CongratsScreen
				invoice={data}
				options={exportOption}
				footer={
					<div className="flex justify-between mt-12 gap-3">
							<Button as={Link} href={uri.create_invoice} disableRipple className="px-7 py-6 text-white bg-black">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
								Create New Invoice</Button>
							<Button onPress={() => setExportOption(prev => ({...prev, selectedOption: '', status: null}))} disableRipple className="px-7 py-6 bg-white text-black border-gray-500 border-1">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
								</svg>
								Re-Export PDF</Button>
						</div>
				}
			/>
		}

		return <Body/>
	}

	return (
			<RootLayout isProtected={true}>
				<Component />
			</RootLayout>
	)
}

export default function App({ params }) {
	const resolveParams = use(params)
	return (
		<InvoiceProvider initialId={resolveParams?.id} mode="send">
			<Main initialId={resolveParams?.id} />
		</InvoiceProvider>
	)
}