"use client";

import {CircleHelp, ClipboardList, Headphones, Home, Info, RefreshCcw, Shield, X} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import Link from "next/link";
import Billing from "@/app/models/Billing";
import {uri} from "@/app/constants/routePaths";
import {formatMoney} from "@/app/utils/money";
import {BilliftyLogo} from "@/app/components/common/NavBar";

const formatDateTime = (value?: string | null) => {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function PaymentCancelled() {
    const params = useParams<{ token?: string | string[] }>();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;

    const {data} = useQuery({
        queryKey: ["payment", token],
        queryFn: async () => (await Billing.getPaymentRecord(token)),
        enabled: Boolean(token),
    });

    const invoice = data?.invoice;
    const invoiceNumber = invoice?.invoice_number ? String(invoice.invoice_number) : "Pending";
    const transactionId = invoiceNumber === "Pending" ? "TXN-CANCELLED" : `TXN-${invoiceNumber}-CANCELLED`;
    const amount = formatMoney(invoice?.total_cents, invoice?.currency?.code);
    const cancelledAt = formatDateTime(invoice?.updated_at ?? invoice?.created_at);
    const retryHref = token ? `/app/pay/${token}` : uri.invoices;

    return (
        <main className="min-h-screen bg-white px-4 py-[58px] font-sans text-[#10141d] sm:px-6">
            <section
                className="mx-auto flex w-full max-w-[672px] flex-col items-center rounded-[18px] border border-[#dedede] bg-[#fbfbfb] px-6 pb-[49px] pt-[83px] sm:px-[48px]">
                <BilliftyLogo width={140} height={140} />
                <div className="flex h-[45px] w-[45px] items-center justify-center">
                    <X className="h-[45px] w-[45px] text-[#ff1f3d]" strokeLinecap="round" strokeWidth={4.8}/>
                </div>

                <h1 className="mt-[57px] text-center text-[34px] font-extrabold leading-none tracking-normal text-[#10141d] sm:text-[38px]">
                    Payment Cancelled
                </h1>
                <p className="mt-[12px] text-center text-[18px] leading-[1.2] text-[#10141d]">
                    Your transaction was not completed
                </p>

                <div
                    className="mt-[19px] w-full rounded-[13px] border border-[#e4e4e4] bg-white px-[23px] py-[25px] shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    <dl className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 sm:gap-x-10">
                        <div>
                            <dt className="text-[14px] leading-none text-[#111318]">Transaction ID</dt>
                            <dd className="mt-[12px] break-words text-[16px] font-extrabold leading-tight text-[#10141d]">
                                {transactionId}
                            </dd>
                        </div>

                        <div className="sm:text-right">
                            <dt className="text-[14px] leading-none text-[#111318]">Date &amp; Time</dt>
                            <dd className="mt-[12px] text-[16px] font-extrabold leading-tight text-[#10141d]">
                                {cancelledAt}
                            </dd>
                        </div>

                        <div className="col-span-full h-px bg-[#e5e5e5]"/>

                        <div>
                            <dt className="text-[14px] leading-none text-[#111318]">Status</dt>
                            <dd className="mt-[13px] flex items-center gap-[8px] text-[14px] font-medium leading-none text-[#f01835]">
                                <span className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#f01835]">
                                    <span className="h-[4px] w-[4px] rounded-full bg-white"/>
                                </span>
                                Cancelled
                            </dd>
                        </div>

                        <div className="sm:text-right">
                            <dt className="text-[14px] leading-none text-[#111318]">Amount</dt>
                            <dd className="mt-[12px] text-[24px] font-extrabold leading-none text-[#10141d]">
                                {amount}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div
                    className="mt-[33px] flex w-full gap-[13px] rounded-[13px] border border-[#e4e4e4] bg-[#fbfbfb] px-[20px] pb-[21px] pt-[24px]">
                    <Info className="mt-[1px] h-[20px] w-[20px] shrink-0 rounded-full fill-[#2fa7df] text-white" strokeWidth={2.4}/>
                    <div>
                        <h2 className="text-[17px] font-extrabold leading-none text-[#10141d]">
                            Why was my payment cancelled?
                        </h2>
                        <p className="mt-[15px] max-w-[488px] text-[14px] leading-[1.55] text-[#111318]">
                            The payment process was interrupted. This could be due to closing the
                            payment window, clicking the cancel button, or a timeout during the
                            transaction. No charges have been made to your account.
                        </p>
                    </div>
                </div>

                <div className="mt-[33px] flex w-full flex-col items-center justify-center gap-[16px] sm:flex-row">
                    <Link
                        className="flex h-[56px] w-full items-center justify-center gap-[10px] rounded-[19px] bg-[#2fa7df] px-[28px] text-[16px] font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-opacity hover:opacity-90 sm:w-[160px]"
                        href={retryHref}
                    >
                        <RefreshCcw className="h-[18px] w-[18px]" strokeWidth={3}/>
                        Try Again
                    </Link>

                    <Link
                        className="flex h-[56px] w-full items-center justify-center gap-[10px] rounded-[19px] border border-[#e1e5e8] bg-[#fbfbfb] px-[28px] text-[16px] font-extrabold text-[#171923] shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-opacity hover:opacity-90 sm:w-[194px]"
                        href={uri.invoices}
                    >
                        <Home className="h-[18px] w-[18px] fill-[#171923]" strokeWidth={2.4}/>
                        Return Home
                    </Link>
                </div>

                <div className="mt-[30px] h-px w-full bg-[#e3e3e3]"/>

                {/*<p className="mt-[28px] text-center text-[14px] leading-none text-[#111318]">*/}
                {/*    Need help with your order?*/}
                {/*</p>*/}

                {/*<div className="mt-[18px] flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[10px] text-[14px] text-[#2fa7df]">*/}
                {/*    <a className="flex items-center gap-[7px] transition-opacity hover:opacity-80" href="mailto:support@billifty.com">*/}
                {/*        <Headphones className="h-[15px] w-[15px]" strokeWidth={2.4}/>*/}
                {/*        Contact Support*/}
                {/*    </a>*/}
                {/*    <span className="hidden h-[18px] w-px bg-[#e4e4e4] sm:block" aria-hidden="true"/>*/}
                {/*    <Link className="flex items-center gap-[7px] transition-opacity hover:opacity-80" href="/#faq">*/}
                {/*        <CircleHelp className="h-[15px] w-[15px]" fill="currentColor" strokeWidth={2.4}/>*/}
                {/*        FAQs*/}
                {/*    </Link>*/}
                {/*    <span className="hidden h-[18px] w-px bg-[#e4e4e4] sm:block" aria-hidden="true"/>*/}
                {/*    <Link className="flex items-center gap-[7px] transition-opacity hover:opacity-80" href={uri.invoices}>*/}
                {/*        <ClipboardList className="h-[15px] w-[15px]" strokeWidth={2.4}/>*/}
                {/*        View Order History*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </section>

            <p className="mx-auto mt-[26px] flex max-w-[672px] items-center justify-center gap-[9px] text-center text-[14px] leading-[1.35] text-[#111318]">
                <Shield className="h-[15px] w-[15px] shrink-0 fill-[#2fa7df] text-[#2fa7df]" strokeWidth={2.3}/>
                <span>Your payment information is secure and has not been processed</span>
            </p>
        </main>
    );
}
