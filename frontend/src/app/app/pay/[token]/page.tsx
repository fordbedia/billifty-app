"use client";

import {CreditCard, LockKeyhole, Tag} from "lucide-react";
import {useParams} from "next/navigation";
import {type ReactNode, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import Billing from "@/app/models/Billing";
import {formatMoney} from "@/app/utils/money";
import {BilliftyLogo} from "@/app/components/common/NavBar";

type ErrorResponse = {
    message?: string;
};

type PaymentProvider = "stripe" | "paypal" | "cashapp";

type CurrencyRecord = {
    code?: string | null;
};

type ClientRecord = {
    company?: string | null;
    email?: string | null;
    name?: string | null;
};

type BusinessProfileRecord = {
    email?: string | null;
    legal_name?: string | null;
    logo_path?: string | null;
    logo_url?: string | null;
    name?: string | null;
};

type InvoiceItemRecord = {
    amount_cents?: number | string | null;
    description?: string | null;
    id?: number | string | null;
    line_discount_cents?: number | string | null;
    line_discount_rate?: number | string | null;
    line_total_cents?: number | string | null;
    name?: string | null;
    quantity?: number | string | null;
    tax_cents?: number | string | null;
    unit?: string | null;
    unit_price_cents?: number | string | null;
};

type InvoiceRecord = {
    amount_due_cents?: number | string | null;
    businessProfile?: BusinessProfileRecord | null;
    business_profile?: BusinessProfileRecord | null;
    client?: ClientRecord | null;
    currency?: CurrencyRecord | null;
    discount_cents?: number | string | null;
    discount_mode?: "none" | "amount" | "percent" | "per-line" | string | null;
    discount_rate?: number | string | null;
    due_on?: string | null;
    invoice_items?: InvoiceItemRecord[] | null;
    invoice_number?: string | null;
    issued_on?: string | null;
    items?: InvoiceItemRecord[] | null;
    shipping_cents?: number | string | null;
    shipping_tax_cents?: number | string | null;
    status?: string | null;
    subtotal_cents?: number | string | null;
    tax_cents?: number | string | null;
    total_cents?: number | string | null;
};

type PaymentRecord = {
    invoice?: InvoiceRecord | null;
    payment_methods?: PaymentProvider[] | string[] | null;
};

type DisplayInvoiceItem = {
    detail: string;
    discountCents: number;
    discountLabel: string | null;
    id: string;
    lineTotalCents: number;
    title: string;
};

type PaymentButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    icon: ReactNode;
    onClick: () => void;
    tone: "primary" | "light" | "cashapp";
};

function PayPalButtonIcon() {
    return (
        <svg aria-hidden="true" className="h-[24px] w-[24px] shrink-0" viewBox="0 0 34 34">
            <path
                d="M11.3 5.5h10.2c4.8 0 7.9 3.1 7 7.5-.9 4.7-4.5 7.4-9.8 7.4h-3.2l-1.1 6.1H8.7L11.3 5.5Z"
                fill="#009cde"
                opacity="0.96"
            />
            <path
                d="M15.2 8.2h8.5c4.1 0 6.5 2.6 5.7 6.3-.8 4-3.9 6.4-8.4 6.4h-3.1l-1.2 7.1h-5.5l4-19.8Z"
                fill="#003087"
            />
        </svg>
    );
}

function CashAppIcon() {
    return <span className="text-[25px] font-black leading-none">$</span>;
}

function toOptionalNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

function cents(value: unknown): number {
    return Math.round(toOptionalNumber(value) ?? 0);
}

function percent(value: unknown): number {
    return toOptionalNumber(value) ?? 0;
}

function formatDate(value?: string | null): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function formatQuantity(value: unknown): string {
    const quantity = toOptionalNumber(value) ?? 0;

    if (Number.isInteger(quantity)) {
        return String(quantity);
    }

    return quantity.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });
}

function formatPercent(value: unknown): string {
    const rate = percent(value);

    return rate.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });
}

function getCurrencyCode(invoice?: InvoiceRecord | null): string {
    return invoice?.currency?.code ?? "USD";
}

function getBusinessProfile(invoice?: InvoiceRecord | null): BusinessProfileRecord | null {
    return invoice?.businessProfile ?? invoice?.business_profile ?? null;
}

function getInvoiceItems(invoice?: InvoiceRecord | null): InvoiceItemRecord[] {
    const rawItems = invoice?.items ?? invoice?.invoice_items;

    return Array.isArray(rawItems) ? rawItems : [];
}

function getItemBaseCents(item: InvoiceItemRecord): number {
    return Math.round((toOptionalNumber(item.quantity) ?? 0) * (toOptionalNumber(item.unit_price_cents) ?? 0));
}

function getItemLineTotalCents(item: InvoiceItemRecord): number {
    const directAmount =
        toOptionalNumber(item.line_total_cents) ??
        toOptionalNumber(item.amount_cents);

    if (directAmount !== null) {
        return Math.round(directAmount);
    }

    return getItemBaseCents(item) + cents(item.tax_cents);
}

function getItemDiscountCents(item: InvoiceItemRecord, invoice?: InvoiceRecord | null): number {
    if (invoice?.discount_mode !== "per-line") {
        return 0;
    }

    const fixedDiscount = cents(item.line_discount_cents);

    if (fixedDiscount > 0) {
        return fixedDiscount;
    }

    const lineDiscountRate = percent(item.line_discount_rate);

    if (lineDiscountRate <= 0) {
        return 0;
    }

    return Math.round(getItemBaseCents(item) * (lineDiscountRate / 100));
}

function getLineSubtotalCents(item: InvoiceItemRecord, invoice?: InvoiceRecord | null): number {
    const lineTotal = getItemLineTotalCents(item);
    const tax = cents(item.tax_cents);

    if (lineTotal > 0) {
        return Math.max(0, lineTotal - tax);
    }

    return Math.max(0, getItemBaseCents(item) - getItemDiscountCents(item, invoice));
}

function buildItemDetail(item: InvoiceItemRecord, currency: string): string {
    const quantity = formatQuantity(item.quantity);
    const unitPrice = formatMoney(cents(item.unit_price_cents), currency);
    const unit = item.unit ? `/${item.unit}` : "";

    return `${quantity} x ${unitPrice}${unit}`;
}

function buildDiscountLabel(invoice?: InvoiceRecord | null): string | null {
    const discountCents = cents(invoice?.discount_cents);
    const discountRate = percent(invoice?.discount_rate);

    if (!invoice?.discount_mode || invoice.discount_mode === "none") {
        return null;
    }

    if (invoice.discount_mode === "percent") {
        return discountRate > 0 ? `Discount (${formatPercent(discountRate)}%)` : "Discount";
    }

    if (invoice.discount_mode === "amount") {
        return discountCents > 0 ? "Discount" : null;
    }

    if (invoice.discount_mode === "per-line") {
        return discountCents > 0 ? "Line discounts" : null;
    }

    return null;
}

function getStatusLabel(status?: string | null): string {
    const labels: Record<string, string> = {
        draft: "Draft",
        issued: "Awaiting Payment",
        paid: "Paid",
        partially: "Partially Paid",
        sent: "Awaiting Payment",
        void: "Void",
    };

    return labels[status ?? ""] ?? "Awaiting Payment";
}

function getClientName(invoice?: InvoiceRecord | null): string {
    return invoice?.client?.company || invoice?.client?.name || "Client";
}

function getClientEmail(invoice?: InvoiceRecord | null): string {
    return invoice?.client?.email || "";
}

function getClientInitials(invoice?: InvoiceRecord | null): string {
    const name = getClientName(invoice);
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return initials || "C";
}

function getBusinessName(invoice?: InvoiceRecord | null): string {
    const businessProfile = getBusinessProfile(invoice);

    return businessProfile?.legal_name || businessProfile?.name || "Billifty";
}

function getBusinessLogoUrl(invoice?: InvoiceRecord | null): string | null {
    const businessProfile = getBusinessProfile(invoice);
    const logoPath = businessProfile?.logo_url || businessProfile?.logo_path;

    if (!logoPath) {
        return null;
    }

    if (logoPath.startsWith("http://") || logoPath.startsWith("https://") || logoPath.startsWith("/")) {
        return logoPath;
    }

    return `/storage/${logoPath.replace(/^\/+/, "")}`;
}

function PaymentButton({children, disabled = false, icon, onClick, tone}: PaymentButtonProps) {
    const toneClasses = {
        cashapp: "border border-[#10d837] bg-[#10d837] text-white shadow-[0_14px_28px_rgba(16,216,55,0.24),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#0fcf34]",
        light: "border border-[#e4e9ef] bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:border-[#d8e1ea] hover:bg-[#fbfdff]",
        primary: "border border-[#2699df] bg-[#2fa1e8] text-white shadow-[0_15px_30px_rgba(47,161,232,0.32),inset_0_2px_0_rgba(255,255,255,0.16)] hover:bg-[#2499df]",
    };

    return (
        <button
            className={`flex h-[58px] w-full cursor-pointer items-center justify-center gap-[11px] rounded-[17px] text-[17px] font-extrabold leading-none transition disabled:cursor-wait disabled:opacity-75 ${toneClasses[tone]}`}
            disabled={disabled}
            onClick={onClick}
            type="button"
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

export default function Pay() {
    const params = useParams<{ token?: string | string[] }>();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState<Record<PaymentProvider, boolean>>({
        cashapp: false,
        paypal: false,
        stripe: false,
    });

    const {data, error: dataError, isError: dataIsError, isLoading} = useQuery<PaymentRecord>({
        enabled: Boolean(token),
        queryKey: ["payment", token],
        queryFn: async () => (await Billing.getPaymentRecord(token)),
        retry: false,
    });

    const invoice = data?.invoice;
    const currency = getCurrencyCode(invoice);
    const businessProfile = getBusinessProfile(invoice);
    const amountDueCents = cents(invoice?.amount_due_cents ?? invoice?.total_cents);
    const subtotalCents = cents(invoice?.subtotal_cents);
    const taxCents = cents(invoice?.tax_cents);
    const shippingCents = cents(invoice?.shipping_cents);
    const shippingTaxCents = cents(invoice?.shipping_tax_cents);
    const discountCents = cents(invoice?.discount_cents);
    const discountLabel = buildDiscountLabel(invoice);
    const invoiceNumber = invoice?.invoice_number ? `#${invoice.invoice_number}` : "-";
    const businessLogoUrl = getBusinessLogoUrl(invoice);

    const hasPaymentMethod = (method: PaymentProvider) => {
        return data?.payment_methods?.some((paymentMethod) => paymentMethod === method) ?? false;
    };

    const displayInvoiceItems: DisplayInvoiceItem[] = getInvoiceItems(invoice).map((item, index) => {
        const discount = getItemDiscountCents(item, invoice);
        const lineDiscountRate = percent(item.line_discount_rate);
        const discountText = discount > 0
            ? lineDiscountRate > 0
                ? `Line discount (${formatPercent(lineDiscountRate)}%)`
                : "Line discount"
            : null;

        return {
            detail: buildItemDetail(item, currency),
            discountCents: discount,
            discountLabel: discountText,
            id: String(item.id ?? `${item.description ?? item.name ?? "item"}-${index}`),
            lineTotalCents: getLineSubtotalCents(item, invoice),
            title: item.name || item.description || `Invoice item ${index + 1}`,
        };
    });

    const handleStripePayment = async () => {
        if (!token) return;

        try {
            setError(null);
            setIsRedirecting((prev) => ({...prev, stripe: true}));

            const paymentLink = await Billing.getPaymentLink("stripe", token);
            if (!paymentLink) return;

            window.location.href = paymentLink.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to start card payment.");
            setIsRedirecting((prev) => ({...prev, stripe: false}));
        }
    };

    const handlePayPalPayment = async () => {
        if (!token) return;

        try {
            setError(null);
            setIsRedirecting((prev) => ({...prev, paypal: true}));

            const paymentLink = await Billing.getPaymentLink("paypal", token);
            if (!paymentLink) return;

            window.location.href = paymentLink.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to start PayPal payment.");
            setIsRedirecting((prev) => ({...prev, paypal: false}));
        }
    };

    const handleCashAppPayment = () => {
        setError("Cash App payments are coming soon.");
    };

    useEffect(() => {
        if (!dataIsError) return;

        if (isAxiosError<ErrorResponse>(dataError)) {
            setError(dataError.response?.data?.message ?? dataError.message);
            return;
        }

        setError(dataError?.message ?? "Unable to load payment details.");
    }, [dataError, dataIsError]);

    return (
        <main className="min-h-screen bg-[#eef6ff] px-4 py-8 font-sans text-[#0d111b] sm:px-6 sm:py-10">
            <section className="mx-auto w-full max-w-[640px]">
                <div className="overflow-hidden rounded-[28px] border border-[#dce8f2] bg-white shadow-[0_18px_52px_rgba(27,70,115,0.13)] sm:rounded-[32px]">
                    <header className="!px-9 !pb-8 !pt-8 sm:px-[44px] sm:pb-9 sm:pt-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div className="[&_.billifty-logo-img]:!h-auto [&_.billifty-logo-link]:inline-flex [&_.billifty-logo-link]:items-center">
                                <BilliftyLogo width={142} height={52}/>
                            </div>

                            <div className="inline-flex h-[32px] items-center self-start rounded-full bg-[#e9f1fa] px-[17px] text-[14px] font-extrabold text-[#4797d5] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                <span className={"mr-[8px] h-[8px] w-[8px] rounded-full " + (invoice?.status === 'paid' ? ' bg-[#56d626] ' : ' bg-[#f6bb35] ')}/>
                                {getStatusLabel(invoice?.status)}
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 px-1.5 sm:grid-cols-2 sm:items-start">
                            <div>
                                <p className="text-[15px] font-medium uppercase leading-none tracking-[0.18em] text-[#0d111b]">
                                    Invoice
                                </p>
                                <h1 className="mt-3 break-words text-[24px] font-black leading-tight tracking-[-0.03em] text-[#0d111b] sm:text-[27px]">
                                    {invoiceNumber}
                                </h1>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-[15px] font-medium uppercase leading-none tracking-[0.18em] text-[#0d111b]">
                                    Due Date
                                </p>
                                <p className="mt-3 text-[19px] font-extrabold leading-tight text-[#0d111b]">
                                    {formatDate(invoice?.due_on)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-5 rounded-[20px] border border-[#e5e8eb] bg-[#fbfbfc] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
                            <div className="flex items-center gap-3 text-left text-[14px] leading-tight text-[#0d111b]">
                                {businessLogoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element -- Business logos can be local storage paths or tenant-provided URLs.
                                    <img
                                        alt={`${getBusinessName(invoice)} logo`}
                                        className="h-[38px] w-[38px] shrink-0 rounded-full border border-[#e5e8eb] bg-white object-contain p-1"
                                        src={businessLogoUrl}
                                    />
                                ) : null}
                                <div>
                                    <p className="font-medium">Billed by</p>
                                    <p className="mt-1 max-w-[240px] text-[15px] font-extrabold sm:max-w-[240px]">
                                        {getBusinessName(invoice)}
                                    </p>
                                    {businessProfile?.email ? (
                                        <p className="mt-1 max-w-[240px] truncate text-[13px] font-medium text-[#4b5563] sm:max-w-[240px]">
                                            {businessProfile.email}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex min-w-0 items-center gap-4 sm:justify-end sm:text-right">
                                <div className="min-w-0">
                                    <p className="truncate text-[19px] font-extrabold leading-tight text-[#0d111b]">
                                        {getClientName(invoice)}
                                    </p>
                                    {getClientEmail(invoice) ? (
                                        <p className="mt-1 truncate text-[14px] font-medium leading-tight text-[#111827]">
                                            {getClientEmail(invoice)}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className="border-y border-[#e4e7eb] bg-[linear-gradient(180deg,#f2f8ff_0%,#ffffff_100%)] px-9 py-7 text-center sm:px-[44px] sm:py-8">
                        <p className="text-[14px] font-semibold uppercase leading-none tracking-[0.26em] text-[#0d111b]">
                            Amount Due
                        </p>
                        <p className="mt-4 text-[40px] font-black leading-none tracking-[-0.06em] text-[#0d111b] sm:text-[54px]">
                            {isLoading ? "..." : formatMoney(amountDueCents, currency)}
                        </p>
                        <p className="mt-4 text-[15px] font-medium leading-none text-[#111827]">
                            {currency.toUpperCase()} · Secure Payment
                        </p>
                    </section>

                    <section className="px-9 py-7 sm:px-[44px]">
                        <h2 className="text-[15px] font-medium uppercase leading-none tracking-[0.18em] text-[#0d111b]">
                            Services
                        </h2>

                        <div className="mt-5 divide-y divide-[#e7eaed]">
                            {displayInvoiceItems.length > 0 ? displayInvoiceItems.map((item) => (
                                <div className="grid gap-3 py-5 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start" key={item.id}>
                                    <div className="min-w-0">
                                        <p className="break-words text-[17px] font-extrabold leading-tight text-[#0d111b]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-[14px] font-medium leading-tight text-[#111827]">
                                            {item.detail}
                                        </p>
                                        {item.discountLabel ? (
                                            <p className="mt-2 text-[13px] font-semibold leading-tight text-[#2fb36f]">
                                                {item.discountLabel}: -{formatMoney(item.discountCents, currency)}
                                            </p>
                                        ) : null}
                                    </div>
                                    <p className="text-left text-[17px] font-extrabold leading-tight text-[#0d111b] sm:text-right">
                                        {formatMoney(item.lineTotalCents, currency)}
                                    </p>
                                </div>
                            )) : (
                                <div className="py-5 text-[15px] font-medium text-[#4b5563]">
                                    No invoice services found.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="border-y border-[#e4e7eb] bg-[#fbfbfc] px-9 py-6 sm:px-[44px]">
                        <dl className="grid gap-4 text-[17px] leading-none text-[#0d111b]">
                            <div className="flex items-center justify-between gap-5">
                                <dt>Subtotal</dt>
                                <dd className="font-medium">{formatMoney(subtotalCents, currency)}</dd>
                            </div>

                            {discountLabel && discountCents > 0 ? (
                                <div className="flex items-center justify-between gap-5">
                                    <dt className="flex items-center gap-2">
                                        <Tag className="h-[19px] w-[19px] fill-[#22bf73] text-[#22bf73]" strokeWidth={2.4}/>
                                        {discountLabel}
                                    </dt>
                                    <dd className="font-medium text-[#2fb36f]">-{formatMoney(discountCents, currency)}</dd>
                                </div>
                            ) : null}

                            {shippingCents > 0 ? (
                                <div className="flex items-center justify-between gap-5">
                                    <dt>Shipping</dt>
                                    <dd className="font-medium">{formatMoney(shippingCents, currency)}</dd>
                                </div>
                            ) : null}

                            <div className="flex items-center justify-between gap-5">
                                <dt>Tax</dt>
                                <dd className="font-medium">{formatMoney(taxCents, currency)}</dd>
                            </div>

                            {shippingTaxCents > 0 ? (
                                <div className="flex items-center justify-between gap-5">
                                    <dt>Shipping Tax</dt>
                                    <dd className="font-medium">{formatMoney(shippingTaxCents, currency)}</dd>
                                </div>
                            ) : null}

                            <div className="mt-1 h-px bg-[#e4e7eb]"/>

                            <div className="flex items-center justify-between gap-5 pt-1">
                                <dt className="font-extrabold">Balance Due</dt>
                                <dd className="font-black text-[#2fa1e8]">{formatMoney(amountDueCents, currency)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="px-9 pb-8 pt-7 sm:px-[44px] sm:pb-9">
                        <div className="grid gap-4">
                            {hasPaymentMethod("stripe") ? (
                                <PaymentButton
                                    disabled={isRedirecting.stripe}
                                    icon={<CreditCard className="h-[27px] w-[27px]" strokeWidth={3}/>}
                                    onClick={handleStripePayment}
                                    tone="primary"
                                >
                                    {isRedirecting.stripe ? "Redirecting..." : "Pay with Card"}
                                </PaymentButton>
                            ) : null}

                            {hasPaymentMethod("paypal") ? (
                                <PaymentButton
                                    disabled={isRedirecting.paypal}
                                    icon={<PayPalButtonIcon/>}
                                    onClick={handlePayPalPayment}
                                    tone="light"
                                >
                                    {isRedirecting.paypal ? "Redirecting..." : "Pay with PayPal"}
                                </PaymentButton>
                            ) : null}

                            {hasPaymentMethod("cashapp") ? (
                                <PaymentButton
                                    disabled={isRedirecting.cashapp}
                                    icon={<CashAppIcon/>}
                                    onClick={handleCashAppPayment}
                                    tone="cashapp"
                                >
                                    {isRedirecting.cashapp ? "Redirecting..." : "Pay with Cash App"}
                                </PaymentButton>
                            ) : null}
                        </div>

                        {error ? (
                            <p className="mt-5 text-center text-[16px] font-semibold text-[#d03333]">{error}</p>
                        ) : null}

                        <div className="mt-7 flex items-center justify-center gap-[8px] text-center text-[15px] font-medium leading-tight text-[#0d111b]">
                            <LockKeyhole className="h-[17px] w-[17px] fill-[#0d111b] text-[#0d111b]" strokeWidth={2.5}/>
                            <span>256-bit SSL encryption · Powered by Billifty</span>
                        </div>
                    </section>
                </div>

                <p className="mx-auto mt-[25px] max-w-[520px] text-center text-[15px] leading-[1.35] text-[#101318]">
                    Your payment information is processed securely. We do not store credit card
                    details.
                </p>
            </section>
        </main>
    );
}
