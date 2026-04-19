"use client";

import React, { use } from "react";
import { InvoiceProvider } from "@/app/providers/InvoiceContext";
import RootLayout from "@/app/components/common/RootLayout";
import { Button, Checkbox, Link } from "@heroui/react";
import { Divider } from "@heroui/divider";
import Tiptap from "@/app/components/wysiwyg/TipTap";
import { useInvoice } from "@/app/providers/InvoiceContext";
import InvoicePreviewPage from "@/app/app/invoice/components/InvoicePreviewPage";
import { uri } from "@/app/constants/routePaths";
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
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-8"
      >
        <circle cx="12" cy="12" r="8.25" strokeDasharray="1 2.6" />
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
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-8"
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
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-8"
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

function Main({ initialId }) {
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
  } = useInvoice();

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
    } else if (exportOption?.selectedOption === "directSendToClient") {
      button = (
        <Button
          onPress={sendToClient}
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
      <InvoicePreviewPage invoiceId={initialId} />
      <div className="app app-wrapper min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[980px] px-5 pb-12 pt-10 sm:px-8 sm:pt-12 lg:pt-16">
          <div className="mb-10 text-center sm:mb-12">
            <h1 className="text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[54px]">
              Delivery Options
            </h1>
            <p className="mt-4 text-lg font-light leading-7 tracking-normal text-[#4e4e4e] sm:text-[20px]">
              Select options for delivery of your invoice
            </p>
          </div>

          <div className="w-full">
            <fieldset className="mx-auto w-full max-w-[882px]">
              <legend className="sr-only">
                Select options for delivery of your invoice
              </legend>

              <div className="grid gap-6 sm:gap-[26px]">
                {EXPORT_OPTIONS.map((opt) => {
                  const selected = exportOption.selectedOption === opt.value;

                  return (
                    <label
                      key={opt.value}
                      className={[
                        "group relative flex min-h-[118px] cursor-pointer items-center rounded-[14px] border px-7 py-6",
                        "bg-[#fdfdfd] shadow-[0_1px_4px_rgba(0,0,0,0.04)]",
                        "transition-all duration-300 ease-out",
                        "hover:-translate-y-0.5 hover:border-[#5ca7dd] hover:bg-[#eef6ff] hover:shadow-[0_14px_38px_rgba(54,115,169,0.14)]",
                        "focus-within:ring-2 focus-within:ring-[#5ca7dd] focus-within:ring-offset-2",
                        "sm:min-h-[136px] sm:px-8",
                        selected
                          ? "border-[#5ca7dd] bg-[#eaf3fd] shadow-[0_10px_28px_rgba(74,151,214,0.18)]"
                          : "border-[#e6e6e6]",
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

                      <div className="flex w-full items-center gap-6 pr-11">
                        <div
                          className={[
                            "shrink-0 transition-all duration-300 group-hover:scale-110",
                            selected ? "text-[#4b9cdc]" : "text-[#161616]",
                          ].join(" ")}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <h2
                            className={[
                              "pb-2 text-[22px] font-medium leading-7 tracking-normal transition-colors duration-300 sm:text-[24px]",
                              selected ? "text-[#5a9fd4]" : "text-[#242424]",
                            ].join(" ")}
                          >
                            {opt.title}
                          </h2>
                          <p className="text-[16px] font-light leading-6 tracking-normal text-[#3f3f3f] sm:text-[18px]">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute right-8 top-1/2 flex h-[23px] w-[23px] -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300",
                          selected
                            ? "border-[#4b9cdc] bg-[#4b9cdc] shadow-[0_0_0_5px_rgba(75,156,220,0.10)]"
                            : "border-[#e3e3e3] bg-white group-hover:border-[#9bc8ec]",
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

          <div className="mx-auto mt-8 w-full max-w-[882px]"></div>

          {exportOption &&
            Object.keys(exportOption).length > 0 &&
            exportOption?.selectedOption === "directSendToClient" && (
              <div className="mx-auto w-full max-w-[882px]">
                <Tiptap
                  initialValue={exportMessage}
                  onCommit={setExportMessage}
                />
              </div>
            )}

          {exportOption &&
            Object.keys(exportOption).length > 0 &&
            exportOption?.selectedOption === "sendCopyToMe" && (
              <div className="mx-auto flex w-full max-w-[882px] flex-col gap-3">
                <Checkbox
                  color="primary"
                  isSelected={hasCsvReport}
                  onValueChange={setHasCsvReport}
                >
                  Include a CSV report for this invoice
                </Checkbox>
              </div>
            )}

          <div className="mx-auto mt-10 w-full max-w-[882px]">
            <Divider />

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
                <Buttons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const Component = () => {
    if (typeof isLoadingInvoice !== undefined && isLoadingInvoice) {
      return <BSpinner />;
    }

    if (isInvoiceError) {
      return <NotFound />;
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

    return <Body />;
  };

  return (
    <RootLayout>
      <Component />
    </RootLayout>
  );
}

export default function App({ params }) {
  const resolveParams = use(params);
  return (
    <InvoiceProvider initialId={resolveParams?.id} mode="send">
      <Main initialId={resolveParams?.id} />
    </InvoiceProvider>
  );
}
