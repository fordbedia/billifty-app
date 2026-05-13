"use client"

import {Download, FileText, Headphones, LayoutDashboard, MailCheck} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import Billing from "@/app/models/Billing";
import {formattedDate} from "@/app/utils/date";
import {useParams} from 'next/navigation';
import {formatMoney} from "@/app/utils/money";
import {uri} from "@/app/constants/routePaths";

export default function PaymentSuccess() {
    const params = useParams()
    const token = params.token;

    const {data} = useQuery({
        queryKey: ['payment-success', token],
        queryFn: async () => (await Billing.invoiceSuccessPayment(token)),
        retry: false,
    })

    const detailRows = [
        ["Payment Reference", data?.data?.stripe_payment_intent_id],
        ["Invoice Number", `#${data?.data?.invoice_number}`],
        ["Amount Paid", formatMoney(data?.data?.amount_paid, data?.data?.currency)],
        ["Payment Date", formattedDate(data?.data?.payment_date)],
    ];

    return (
        <main className="min-h-screen bg-white px-4 py-6 font-sans text-[#10141d] sm:px-6">
            <section
                className="mx-auto flex w-full max-w-[760px] flex-col items-center rounded-[32px] border border-[#dce2e8] bg-[#fefefe] px-5 pb-10 pt-12 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-10 lg:px-14">
                <div
                    className="flex h-[112px] w-[112px] items-center justify-center rounded-full bg-[#10c187] shadow-[inset_0_-4px_0_rgba(0,0,0,0.04)]">
                    <svg
                        aria-hidden="true"
                        className="h-[50px] w-[50px]"
                        fill="none"
                        viewBox="0 0 82 82"
                    >
                        <path
                            d="M18 42.5 34.1 58 64 25"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="9"
                        />
                    </svg>
                </div>

                <h1 className="mt-9 text-center text-[34px] font-extrabold leading-none tracking-normal text-[#10141d] sm:text-[48px]">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-center text-[18px] font-normal leading-tight text-[#111111] sm:text-[24px]">
                    Your invoice has been paid successfully
                </p>

                <div className="mt-8 w-full max-w-[620px] rounded-[22px] bg-[#eaf1fc] px-6 py-7 sm:px-9">
                    <dl className="grid gap-5">
                        {detailRows.map(([label, value]) => (
                            <div
                                className="grid grid-cols-1 gap-1 text-[18px] leading-tight sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:text-[22px]"
                                key={label}
                            >
                                <dt className="font-normal text-[#111111]">{label}</dt>
                                <dd
                                    className={`text-left font-extrabold text-[#10141d] sm:text-right ${
                                        label === "Amount Paid" ? "text-[#22c789]" : ""
                                    }`}
                                >
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div
                    className="mt-7 grid w-full max-w-[620px] grid-cols-[38px_1fr_38px] items-center rounded-[22px] bg-[#e6e6e8] px-6 py-5">
                    <MailCheck className="h-7 w-7 text-[#2f9ce6]" strokeWidth={2.4}/>
                    <p className="text-center text-[16px] font-normal leading-[1.35] text-[#111111] sm:text-[20px]">
                        A confirmation email has been sent to your
                        <br/>
                        registered email address
                    </p>
                    <span aria-hidden="true"/>
                </div>

                <div className="mt-10 flex w-full max-w-[620px] flex-col gap-4">
                    <a
                        target="_blank"
                        className="flex h-[68px] w-full items-center justify-center gap-4 rounded-[22px] bg-[#2d9eea] text-[20px] font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-opacity hover:opacity-90 sm:text-[24px]"
                        href={data?.data?.receipt_url}
                    >
                        <Download className="h-7 w-7" strokeWidth={3.2}/>
                        Download Receipt
                    </a>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                        <a
                            className="flex min-h-[86px] items-center justify-center gap-4 rounded-[22px] bg-[#eaf1fc] px-6 text-center text-[20px] font-extrabold leading-[1.25] text-[#2d9eea] transition-opacity hover:opacity-90 sm:text-left sm:text-[24px]"
                            href={uri.invoices}
                        >
                            <LayoutDashboard className="h-8 w-8 shrink-0" strokeWidth={2.4}/>
                            <span>
                                Back to
                                <br/>
                                Dashboard
                            </span>
                        </a>

                        {/*<a*/}
                        {/*    className="flex min-h-[86px] items-center justify-center gap-4 rounded-[22px] bg-[#10131b] px-6 text-[20px] font-extrabold text-white transition-opacity hover:opacity-90 sm:text-[24px]"*/}
                        {/*    href="#"*/}
                        {/*>*/}
                        {/*    <FileText className="h-7 w-7 shrink-0" strokeWidth={2.8}/>*/}
                        {/*    View Invoice*/}
                        {/*</a>*/}
                    </div>
                </div>

                <div className="mt-7 h-px w-full max-w-[620px] bg-[#e3e3e3]"/>

                {/*<p className="mt-7 text-center text-[18px] font-normal text-[#111111] sm:text-[20px]">*/}
                {/*    Need help with your payment?*/}
                {/*</p>*/}
                {/*<a*/}
                {/*    className="mt-5 flex items-center justify-center gap-3 text-[18px] font-bold text-[#2d9eea] transition-opacity hover:opacity-80 sm:text-[20px]"*/}
                {/*    href="#"*/}
                {/*>*/}
                {/*    <Headphones className="h-6 w-6" strokeWidth={2.8}/>*/}
                {/*    Contact Support*/}
                {/*</a>*/}
            </section>
        </main>
    );
}
