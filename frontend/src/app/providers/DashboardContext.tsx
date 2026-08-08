"use client";

import {InvoiceStatus} from "@/app/enums/InvoiceStatus";
import type {DashboardMetric, RecentInvoice, RevenuePoint, TopClient} from "@/app/app/dashboard/data";
import DashboardModel from "@/app/models/Dashboard";
import {createContext, type ReactNode, useCallback, useContext, useMemo, useState} from "react";

export type DashboardFilterPayload = {
    period: "last-month" | "last-3-months" | "last-6-months" | "last-year" | "custom";
    start_date?: string;
    end_date?: string;
};

type MetricChange = {
    percentage: number | null;
    direction: DashboardMetric["trend"];
    previous_value: number;
    label: string;
};

type InvoiceDashboardMetrics = {
    total_revenue_cents: number;
    outstanding_cents: number;
    overdue_cents: number;
    draft_invoices_count: number;
    total_revenue_change: MetricChange | null;
    outstanding_change: MetricChange | null;
    overdue_change: MetricChange | null;
    draft_invoices_change: MetricChange | null;
};

type RevenueOverviewResponsePoint = {
    month: string;
    revenue_cents: number;
    invoice_count: number;
    paid_cents: number;
    outstanding_cents: number;
    client_count: number;
};

type TrendingInvoiceResponse = {
    recent: Array<{
        issued_on: string | null;
        invoice_number: string;
        total_cents: number;
        status: string;
        client?: {
            name?: string | null;
        } | null;
    }>;
    top_clients: Array<{
        client_id: number;
        invoice_count: number;
        total_cents: number;
        client?: {
            name?: string | null;
        } | null;
    }>;
};

type DashboardResponse = {
    invoices: InvoiceDashboardMetrics;
    revenue_overview: RevenueOverviewResponsePoint[];
    trending_invoices: TrendingInvoiceResponse;
};

export type DashboardContextValue = {
    dashboardMetrics: DashboardMetric[];
    error: string | null;
    isLoading: boolean;
    loadDashboard: (payload: DashboardFilterPayload) => Promise<void>;
    recentInvoices: RecentInvoice[];
    revenueOverview: RevenuePoint[];
    topClients: TopClient[];
};

type DashboardProviderProps = {
    children: ReactNode;
};

const metricMoneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const dashboardDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

const initialDashboardMetrics: DashboardMetric[] = [
    {title: "Total Revenue", value: "$0.00", change: "Loading...", trend: "flat"},
    {title: "Outstanding", value: "$0.00", change: "Loading...", trend: "flat"},
    {title: "Overdue", value: "$0.00", change: "Loading...", trend: "flat"},
    {title: "Draft Invoices", value: "0", change: "Loading...", trend: "flat"},
];

function changeLabel(change: MetricChange | null) {
    return change?.label ?? "Comparison unavailable";
}

function changeDirection(change: MetricChange | null): DashboardMetric["trend"] {
    return change?.direction ?? "flat";
}

function mapDashboardMetrics(response: DashboardResponse): DashboardMetric[] {
    const invoices = response.invoices;

    return [
        {
            title: "Total Revenue",
            value: metricMoneyFormatter.format(invoices.total_revenue_cents / 100),
            change: changeLabel(invoices.total_revenue_change),
            trend: changeDirection(invoices.total_revenue_change),
        },
        {
            title: "Outstanding",
            value: metricMoneyFormatter.format(invoices.outstanding_cents / 100),
            change: changeLabel(invoices.outstanding_change),
            trend: changeDirection(invoices.outstanding_change),
        },
        {
            title: "Overdue",
            value: metricMoneyFormatter.format(invoices.overdue_cents / 100),
            change: changeLabel(invoices.overdue_change),
            trend: changeDirection(invoices.overdue_change),
        },
        {
            title: "Draft Invoices",
            value: String(invoices.draft_invoices_count),
            change: changeLabel(invoices.draft_invoices_change),
            trend: changeDirection(invoices.draft_invoices_change),
        },
    ];
}

function mapRevenueOverview(response: DashboardResponse): RevenuePoint[] {
    return response.revenue_overview.map((point) => ({
        month: point.month,
        revenue: point.revenue_cents / 100,
        invoices: point.invoice_count,
        paid: point.paid_cents / 100,
        outstanding: point.outstanding_cents / 100,
        clients: point.client_count,
    }));
}

function formatDashboardDate(date: string | null): string {
    if (!date) {
        return "Date unavailable";
    }

    const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

    return Number.isNaN(parsedDate.getTime())
        ? "Date unavailable"
        : dashboardDateFormatter.format(parsedDate);
}

function clientInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "—";
}

function invoiceStatus(status: string): RecentInvoice["status"] {
    return Object.values(InvoiceStatus).includes(status as InvoiceStatus)
        ? status as InvoiceStatus
        : InvoiceStatus.Issued;
}

function mapRecentInvoices(response: DashboardResponse): RecentInvoice[] {
    return (response.trending_invoices?.recent ?? []).map((invoice) => ({
        invoiceNumber: invoice.invoice_number,
        client: invoice.client?.name || "Unknown client",
        date: formatDashboardDate(invoice.issued_on),
        amount: metricMoneyFormatter.format(Number(invoice.total_cents ?? 0) / 100),
        status: invoiceStatus(invoice.status),
    }));
}

function mapTopClients(response: DashboardResponse): TopClient[] {
    return (response.trending_invoices?.top_clients ?? []).map((client) => {
        const name = client.client?.name || "Unknown client";

        return {
            initials: clientInitials(name),
            name,
            invoices: Number(client.invoice_count ?? 0),
            amount: metricMoneyFormatter.format(Number(client.total_cents ?? 0) / 100),
        };
    });
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({children}: DashboardProviderProps) {
    const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(initialDashboardMetrics);
    const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
    const [revenueOverview, setRevenueOverview] = useState<RevenuePoint[]>([]);
    const [topClients, setTopClients] = useState<TopClient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDashboard = useCallback(async (payload: DashboardFilterPayload) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await DashboardModel.dashboard(payload) as DashboardResponse;
            setDashboardMetrics(mapDashboardMetrics(response));
            setRecentInvoices(mapRecentInvoices(response));
            setRevenueOverview(mapRevenueOverview(response));
            setTopClients(mapTopClients(response));
        } catch (requestError) {
            console.error("Unable to load dashboard data", requestError);
            setError("Unable to load dashboard data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = useMemo<DashboardContextValue>(() => ({
        dashboardMetrics,
        error,
        isLoading,
        loadDashboard,
        recentInvoices,
        revenueOverview,
        topClients,
    }), [dashboardMetrics, error, isLoading, loadDashboard, recentInvoices, revenueOverview, topClients]);

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard(): DashboardContextValue {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error("useDashboard must be used inside <DashboardProvider>.");
    }

    return context;
}
