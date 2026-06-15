"use client"

import {InvoiceProps, ReminderIndicatorProps} from "@/app/props/invoice";

export const isInvoicePaid = <T extends InvoiceProps>(data: T): boolean | null => data?.status === 'paid';

export const isInvoiceIssued = <T extends InvoiceProps>(data: T): boolean | null => data?.status === 'issued';

export const isPaymentReminderCompleted = <T extends InvoiceProps>(data: T): boolean | null => !!data?.payment_reminders && !!data?.payment_reminders_completed_at;

export const isPaymentReminderEnabled = <T extends InvoiceProps>(data: T): boolean | null => !!data?.payment_reminders && !!data?.payment_reminders_enabled;

export const reminderIndicator = (data: InvoiceProps): ReminderIndicatorProps => {
    if (isInvoicePaid(data) && isPaymentReminderCompleted(data)) {
        // Invoice is paid and reminders were enabled/completed
        return 'Completed'
    }

    if (isInvoicePaid(data) && !isPaymentReminderEnabled(data)) {
        // Invoice is paid but reminders were never enabled
        return false
    }

    if (isPaymentReminderCompleted(data) && isInvoiceIssued(data)) {
        // All scheduled reminders were sent and invoice is still unpaid
        return 'Reminder sequence ended'
    }

    if (isPaymentReminderEnabled(data) && isInvoiceIssued(data)) {
        // Reminders are enabled and invoice is unpaid
        return 'Active'
    }

    if (!!data?.payment_reminders && !isPaymentReminderEnabled(data) && isInvoiceIssued(data)) {
        // User manually turned reminders off
        return 'Cancelled'
    }

    return false;
}
