export type InvoiceProps = {
    id: number,
    status: string | null,
    payment_reminders_completed_at: string | null,
    payment_reminders?: Record<string, any> | null;
    paymentReminders?: Record<string, any> | null;
    payment_reminders_enabled: boolean;
}

export type ReminderIndicatorProps = string | boolean;
