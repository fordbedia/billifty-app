"use client"

import {InvoiceProps, BusinessProfileRecord, InvoiceItemRecord} from "@/app/props/invoice";

export function getBusinessProfile(invoice?: InvoiceProps | null): BusinessProfileRecord | null {
    return invoice?.businessProfile ?? invoice?.business_profile ?? null;
}

export function getCurrencyCode(invoice?: InvoiceProps | null): string {
    return invoice?.currency?.code ?? "USD";
}

export function getInvoiceItems(invoice?: InvoiceProps | null): InvoiceItemRecord[] {
    const rawItems = invoice?.items ?? invoice?.invoice_items;

    return Array.isArray(rawItems) ? rawItems : [];
}

export function getClientName(invoice?: InvoiceProps | null): string {
    return invoice?.client?.company || invoice?.client?.name || "Client";
}

export function getClientEmail(invoice?: InvoiceProps | null): string {
    return invoice?.client?.email || "";
}

export function getClientInitials(invoice?: InvoiceProps | null): string {
    const name = getClientName(invoice);
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return initials || "C";
}

export function getBusinessName(invoice?: InvoiceProps | null): string {
    const businessProfile = getBusinessProfile(invoice);

    return businessProfile?.legal_name || businessProfile?.name || "Billifty";
}

export function getBusinessLogoUrl(invoice?: InvoiceProps | null): string | null {
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