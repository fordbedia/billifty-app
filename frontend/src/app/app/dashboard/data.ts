import {InvoiceStatus} from "@/app/enums/InvoiceStatus";

export type DashboardMetric = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "flat";
};

export type RevenuePoint = {
    month: string;
    revenue: number;
    invoices: number;
    paid: number;
    outstanding: number;
    clients: number;
};

export type RecentInvoice = {
    invoiceNumber: string;
    client: string;
    date: string;
    amount: string;
    status: InvoiceStatus | "overdue";
};

export type TopClient = {
    initials: string;
    name: string;
    invoices: number;
    amount: string;
};

export const revenueOverview: RevenuePoint[] = [
    {month: "Dec '24", revenue: 4850, invoices: 8, paid: 4200, outstanding: 650, clients: 6},
    {month: "Jan '25", revenue: 7350, invoices: 11, paid: 6600, outstanding: 750, clients: 8},
    {month: "Feb '25", revenue: 5650, invoices: 9, paid: 4950, outstanding: 700, clients: 7},
    {month: "Mar '25", revenue: 6425, invoices: 10, paid: 5750, outstanding: 675, clients: 8},
    {month: "Apr '25", revenue: 8950, invoices: 13, paid: 8100, outstanding: 850, clients: 10},
    {month: "May '25", revenue: 6850, invoices: 12, paid: 5950, outstanding: 900, clients: 9},
];

export const recentInvoices: RecentInvoice[] = [
    {invoiceNumber: "INV-2025-0042", client: "Acme Corporation", date: "May 12, 2025", amount: "$1,250.00", status: InvoiceStatus.Paid},
    {invoiceNumber: "INV-2025-0041", client: "BrightWave Studio", date: "May 9, 2025", amount: "$2,450.00", status: InvoiceStatus.Issued},
    {invoiceNumber: "INV-2025-0040", client: "Summit Solutions", date: "May 6, 2025", amount: "$3,200.00", status: InvoiceStatus.Issued},
    {invoiceNumber: "INV-2025-0039", client: "NorthPeak LLC", date: "May 3, 2025", amount: "$950.00", status: InvoiceStatus.Draft},
    {invoiceNumber: "INV-2025-0038", client: "Pixel Perfect Co.", date: "Apr 30, 2025", amount: "$1,800.00", status: InvoiceStatus.Paid},
];

export const topClients: TopClient[] = [
    {initials: "AC", name: "Acme Corporation", invoices: 5, amount: "$6,450.00"},
    {initials: "BW", name: "BrightWave Studio", invoices: 4, amount: "$4,200.00"},
    {initials: "SS", name: "Summit Solutions", invoices: 3, amount: "$3,150.00"},
    {initials: "NP", name: "NorthPeak LLC", invoices: 2, amount: "$2,100.00"},
];

export const monthlySummary = [
    {label: "Invoices Created", value: "12"},
    {label: "Payments Received", value: "$9,450.00"},
    {label: "Active Clients", value: "18"},
];

export const setupProgress = [
    {label: "Business Profile", description: "Your business details are set.", percent: 100},
    {label: "Payment Methods", description: "2 payment methods added.", percent: 100},
    {label: "Branding", description: "Add your logo and brand colors.", percent: 60},
];
