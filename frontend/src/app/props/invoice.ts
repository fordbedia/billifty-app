export type InvoiceProps = {
    id: number,
    status: string | null,
    payment_reminders_completed_at: string | null,
    payment_reminders: Record<string, any>;
    payment_reminders_enabled: boolean;
}

export type ReminderIndicatorProps = string | boolean;