"use client";

import {ArrowRight, LockKeyhole, Shield} from "lucide-react";
import {useParams} from "next/navigation";
import {type ReactNode, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Billing from "@/app/models/Billing";
import {formatMoney} from "@/app/utils/money";

// const paymentDetails = [
//     {label: "Amount", value: "$99.00", emphasized: true},
//     {label: "Service", value: "Premium Plan"},
//     {label: "Payment ID", value: "#PAY-2024-001"},
// ];

function VisaIcon() {
    return (
        <svg aria-hidden="true" className="h-[17px] w-[25px]" viewBox="0 0 42 28">
            <rect width="42" height="28" rx="3" fill="#f8fbff"/>
            <rect x="3" y="6" width="36" height="16" rx="2" fill="#2fa7df"/>
            <text
                fill="#ffffff"
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fontWeight="700"
                x="21"
                y="17"
                textAnchor="middle"
            >
                VISA
            </text>
        </svg>
    );
}

function MasterCardIcon() {
    return (
        <svg aria-hidden="true" className="h-[17px] w-[25px]" viewBox="0 0 42 28">
            <rect width="42" height="28" rx="3" fill="#f8fbff"/>
            <circle cx="18" cy="14" fill="#ed1b2f" r="7"/>
            <circle cx="24" cy="14" fill="#f79e1b" r="7"/>
            <path d="M21 8.2a8.5 8.5 0 0 1 0 11.6 8.5 8.5 0 0 1 0-11.6Z" fill="#ff5f00"/>
        </svg>
    );
}

function AmexIcon() {
    return (
        <svg aria-hidden="true" className="h-[17px] w-[25px]" viewBox="0 0 42 28">
            <rect width="42" height="28" rx="3" fill="#f8fbff"/>
            <rect x="7" y="5" width="28" height="18" rx="2" fill="#18aa83"/>
            <text
                fill="#ffffff"
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fontWeight="800"
                x="21"
                y="17"
                textAnchor="middle"
            >
                AMEX
            </text>
        </svg>
    );
}

function PayPalIcon() {
    return (
        <svg aria-hidden="true" className="h-[17px] w-[25px]" viewBox="0 0 42 28">
            <rect width="42" height="28" rx="3" fill="#f8fbff"/>
            <rect x="6" y="6" width="30" height="16" rx="2" fill="#eaf6ff"/>
            <path d="M15 9h8.2c3.3 0 5.1 1.6 4.6 4.2-.5 2.7-2.8 4.2-6.1 4.2h-2.8l-.7 3.6h-4.4L15 9Z" fill="#009cde"/>
            <path d="M18.4 7.5h7.2c3.1 0 4.7 1.5 4.2 3.8-.5 2.5-2.6 3.8-5.7 3.8h-2.5l-.6 3.2h-4l1.4-10.8Z" fill="#003087"/>
        </svg>
    );
}

function PaymentMethod({children}: { children: ReactNode }) {
    return (
        <span
            className="flex h-[30px] w-[36px] items-center justify-center rounded-[4px] border border-[#e4e7eb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
            {children}
        </span>
    );
}

export default function Pay() {
    const params = useParams<{ token?: string | string[] }>();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const {data} = useQuery({
        queryKey: ["payment", token],
        queryFn: async () => (await Billing.getPaymentRecord(token))
    })

    const paymentDetails = [
        {label: "Invoice Number", value: data?.invoice?.invoice_number},
        {label: "Amount", value: formatMoney(data?.invoice.total_cents, data?.invoice?.currency?.code), emphasized: true},
    ];

    console.log('data', data)

    const handleStripePayment = async () => {
        if (!token) return;

        try {
            setError(null);
            setIsRedirecting(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_SECURE_URL}/pay/token/${token}`, {
                body: JSON.stringify({provider: "stripe"}),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok || !data?.url) {
                throw new Error(data?.message || "Unable to start Stripe payment.");
            }

            window.location.href = data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to start Stripe payment.");
            setIsRedirecting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white px-4 py-6 font-sans text-[#111827] sm:py-8">
            <section className="mx-auto flex w-full max-w-[512px] flex-col items-center">
                <div
                    className="w-full rounded-[21px] border border-[#dedede] bg-white px-6 pb-[42px] pt-[62px] sm:px-[48px]">
                    <div className="text-center">
                        <div
                            className="text-[12px] font-extrabold leading-none tracking-[-0.01em] text-[#27aee4]">
                            stripe
                        </div>
                        <h1 className="mt-[42px] text-[32px] font-extrabold leading-none tracking-normal text-[#151821]">
                            Secure Payment
                        </h1>
                        <p className="mx-auto mt-[13px] max-w-[360px] text-[18px] leading-[1.28] text-[#171923]">
                            Complete your transaction with Stripe&apos;s secure
                            <br className="hidden sm:block"/>
                            payment gateway
                        </p>
                    </div>

                    <dl className="mt-[35px] grid gap-[21px] rounded-[15px] border border-[#e4e4e4] bg-[#fbfbfb] px-[22px] py-[26px]">
                        {paymentDetails.map((item) => (
                            <div className="flex items-center justify-between gap-6" key={item.label}>
                                <dt className="text-[17px] font-medium leading-none text-[#111318]">
                                    {item.label}
                                </dt>
                                <dd
                                    className={`text-right leading-none text-[#111318] ${
                                        item.emphasized ? "text-[25px] font-extrabold" : "text-[17px] font-medium"
                                    }`}
                                >
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <button
                        className="mt-[32px] flex h-[59px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#2da1e9] text-[18px] font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors hover:bg-[#1994df] disabled:cursor-wait disabled:opacity-75"
                        disabled={isRedirecting}
                        onClick={handleStripePayment}
                        type="button"
                    >
                        <LockKeyhole className="h-[21px] w-[21px]" fill="currentColor" strokeWidth={3}/>
                        <span>{isRedirecting ? "Redirecting..." : "Pay with Stripe"}</span>
                        <ArrowRight className="h-[19px] w-[19px]" strokeWidth={3}/>
                    </button>

                    {error ? (
                        <p className="mt-3 text-center text-[13px] font-medium text-[#d03333]">{error}</p>
                    ) : null}

                    <div className="mt-[19px] flex items-center justify-center gap-[7px] text-[14px] text-[#171923]">
                        <Shield className="h-[16px] w-[16px]" fill="currentColor" strokeWidth={2.3}/>
                        <span>Secured by 256-bit SSL encryption</span>
                    </div>

                    <div className="mt-[37px] border-t border-[#e7e7e7] pt-[26px] text-center">
                        <p className="text-[15px] leading-none text-[#171923]">Accepted payment methods</p>
                        <div className="mt-[19px] flex items-center justify-center gap-[20px]">
                            <PaymentMethod>
                                <VisaIcon/>
                            </PaymentMethod>
                            <PaymentMethod>
                                <MasterCardIcon/>
                            </PaymentMethod>
                            <PaymentMethod>
                                <AmexIcon/>
                            </PaymentMethod>
                            <PaymentMethod>
                                <PayPalIcon/>
                            </PaymentMethod>
                        </div>
                    </div>
                </div>

                <p className="mt-[25px] max-w-[470px] text-center text-[15px] leading-[1.35] text-[#101318]">
                    Your payment information is processed securely. We do not store credit card
                    details.
                </p>
            </section>
        </main>
    );
}
