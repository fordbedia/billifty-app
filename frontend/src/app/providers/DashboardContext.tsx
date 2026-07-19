"use client";

import type {DashboardMetric} from "@/app/app/dashboard/data";
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

type DashboardResponse = {
    invoices: InvoiceDashboardMetrics;
};

type DashboardContextValue = {
    dashboardMetrics: DashboardMetric[];
    error: string | null;
    isLoading: boolean;
    loadDashboard: (payload: DashboardFilterPayload) => Promise<void>;
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

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({children}: DashboardProviderProps) {
    const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(initialDashboardMetrics);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDashboard = useCallback(async (payload: DashboardFilterPayload) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await DashboardModel.dashboard(payload) as DashboardResponse;
            setDashboardMetrics(mapDashboardMetrics(response));
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
    }), [dashboardMetrics, error, isLoading, loadDashboard]);

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
