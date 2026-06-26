import React, {type ReactNode} from "react";
export type ErrorResponse = {
    message?: string;
};

export type PaymentProvider = "stripe" | "paypal" | "cashapp";

export type CurrencyRecord = {
    code?: string | null;
};

export type ClientRecord = {
    company?: string | null;
    email?: string | null;
    name?: string | null;
};

export type BusinessProfileRecord = {
    email?: string | null;
    legal_name?: string | null;
    logo_path?: string | null;
    logo_url?: string | null;
    name?: string | null;
};

export type InvoiceItemRecord = {
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

export type PaymentRecord = {
    invoice?: InvoiceProps | null;
    payment_methods?: PaymentProvider[] | string[] | null;
    user: Record<string, any>;
};

export type DisplayInvoiceItem = {
    detail: string;
    discountCents: number;
    discountLabel: string | null;
    id: string;
    lineTotalCents: number;
    title: string;
};

export type PaymentButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    icon: ReactNode;
    onClick: () => void;
    tone: "primary" | "light" | "cashapp";
};

export type InvoiceProps = {
    id: number,
    payment_reminders_completed_at: string | null,
    payment_reminders?: Record<string, any> | null;
    paymentReminders?: Record<string, any> | null;
    payment_reminders_enabled: boolean;
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
}

export type ReminderIndicatorProps = string | boolean;

export type PlanCodeRecord = "free" | "pro" | "premium"
export type PlanRecord = {
    code: PlanCodeRecord;
    name: string;
    price_monthly: string;
    price_yearly: string;
    id: number;
}

export type UserRecord = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    onboarding: Record<string, any>;
    subscription: Record<string, any | null>;
    plan: PlanRecord;
}

