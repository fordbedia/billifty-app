"use client";

import DashboardSidebar from "@/app/app/component/DashboardSidebar";
import {uri} from "@/app/constants/routePaths";
import {InvoiceStatus} from "@/app/enums/InvoiceStatus";
import {type DashboardFilterPayload, useDashboard} from "@/app/providers/DashboardContext";
import {
    monthlySummary,
    setupProgress,
    type DashboardMetric,
    type RecentInvoice,
    type RevenuePoint,
    type TopClient,
} from "@/app/app/dashboard/data";
import {
    Button,
    Card,
    CardBody,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
} from "@heroui/react";
import {
    BarChart3,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronRight,
    Clock3,
    FileText,
    Plus,
    ReceiptText,
    WalletCards,
} from "lucide-react";
import {type Key, useEffect, useState} from "react";

const reportingPeriods = [
    {key: "last-month", label: "Last month"},
    {key: "last-3-months", label: "Last 3 months"},
    {key: "last-6-months", label: "Last 6 months"},
    {key: "last-year", label: "Last Year"},
    {key: "custom", label: "Custom filter"},
] as const;

type ReportingPeriodKey = (typeof reportingPeriods)[number]["key"];
type DashboardDateRange = {
    start: {year: number; month: number; day: number; toString?: () => string};
    end: {year: number; month: number; day: number; toString?: () => string};
};

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
});

function formatDateRange(range: {
    start: {year: number; month: number; day: number};
    end: {year: number; month: number; day: number};
}) {
    const startDate = new Date(range.start.year, range.start.month - 1, range.start.day);
    const endDate = new Date(range.end.year, range.end.month - 1, range.end.day);

    return `${longDateFormatter.format(startDate)} - ${longDateFormatter.format(endDate)}`;
}

function formatDateForRequest(date: {year: number; month: number; day: number}) {
    return [
        date.year,
        String(date.month).padStart(2, "0"),
        String(date.day).padStart(2, "0"),
    ].join("-");
}

function toCalendarDateParts(date: Date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };
}

function getPresetDateRange(period: Exclude<ReportingPeriodKey, "custom">): DashboardDateRange {
    const endDate = new Date();
    const startDate = new Date(endDate);

    if (period === "last-month") {
        startDate.setMonth(startDate.getMonth() - 1);
    }

    if (period === "last-3-months") {
        startDate.setMonth(startDate.getMonth() - 3);
    }

    if (period === "last-6-months") {
        startDate.setMonth(startDate.getMonth() - 6);
    }

    if (period === "last-year") {
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    return {
        start: toCalendarDateParts(startDate),
        end: toCalendarDateParts(endDate),
    };
}

function buildDashboardPayload(period: ReportingPeriodKey, range?: DashboardDateRange | null): DashboardFilterPayload | null {
    const dateRange = period === "custom" ? range : getPresetDateRange(period);

    if (!dateRange?.start || !dateRange?.end) {
        return null;
    }

    return {
        period,
        start_date: formatDateForRequest(dateRange.start),
        end_date: formatDateForRequest(dateRange.end),
    };
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const metricIcons = [BarChart3, WalletCards, Clock3, FileText];

const statusClasses: Record<RecentInvoice["status"], string> = {
    [InvoiceStatus.Paid]: "bg-green-100 text-green-700",
    [InvoiceStatus.Issued]: "bg-blue-100 text-blue-700",
    [InvoiceStatus.Draft]: "bg-slate-100 text-slate-600",
    [InvoiceStatus.Void]: "bg-red-100 text-red-700",
    overdue: "bg-red-100 text-red-700",
};

export default function Dashboard() {
    const [reportingPeriod, setReportingPeriod] = useState<ReportingPeriodKey>("last-6-months");
    const [customDateRange, setCustomDateRange] = useState<DashboardDateRange | null>(null);
    const {dashboardMetrics, loadDashboard, recentInvoices, revenueOverview, topClients} = useDashboard();

    useEffect(() => {
        const payload = buildDashboardPayload(reportingPeriod, customDateRange);

        if (payload) {
            void loadDashboard(payload);
        }
    }, [customDateRange, loadDashboard, reportingPeriod]);

    return (
        <div className="app app-wrapper min-h-screen dashboard-page invoice-dashboard-page">
            <div className="invoice-dashboard-shell">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <main className="rounded-[14px] border border-[#dbe3ef] bg-white p-5 shadow-[0_30px_70px_-54px_rgba(20,43,72,0.42)] sm:p-7">
                        <DashboardHeader
                            reportingPeriod={reportingPeriod}
                            onCustomDateRangeChange={setCustomDateRange}
                            onReportingPeriodChange={setReportingPeriod}
                        />
                        <MetricGrid metrics={dashboardMetrics} />
                        <RevenueCard data={revenueOverview} />

                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.9fr)]">
                            <RecentInvoicesCard invoices={recentInvoices} />
                            <TopClientsCard clients={topClients} />
                        </div>

                        {/*<SetupProgressCard />*/}
                    </main>

                    <aside className="grid content-start gap-4">
                        <DashboardSidebar />
                        <MonthlySummaryCard />
                    </aside>
                </div>
            </div>
        </div>
    );
}

function DashboardHeader({
    onCustomDateRangeChange,
    reportingPeriod,
    onReportingPeriodChange,
}: {
    onCustomDateRangeChange: (range: DashboardDateRange | null) => void;
    reportingPeriod: ReportingPeriodKey;
    onReportingPeriodChange: (period: ReportingPeriodKey) => void;
}) {
    const reportingPeriodLabel = reportingPeriods.find((period) => period.key === reportingPeriod)?.label;
    const [customDateRangeLabel, setCustomDateRangeLabel] = useState<string | null>(null);

    const selectReportingPeriod = (key: Key) => {
        const period = String(key) as ReportingPeriodKey;

        if (period !== "custom") {
            setCustomDateRangeLabel(null);
            onCustomDateRangeChange(null);
        }

        onReportingPeriodChange(period);
    };

    const handleCustomDateRangeChange = (range: DashboardDateRange | null) => {
        setCustomDateRangeLabel(range ? formatDateRange(range) : null);
        onCustomDateRangeChange(range?.start && range?.end ? range : null);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-[28px] font-extrabold leading-tight text-[#07142c]">Dashboard</h1>
                <p className="mt-2 text-sm text-[#59667d]">
                    Track revenue, invoices, and client activity in one clean view.
                </p>
                <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                className="h-10 min-w-[170px] justify-between rounded-lg border-[#dbe3ef] px-3 text-sm font-bold text-[#53627a]"
                                startContent={<CalendarDays className="size-4" />}
                                endContent={<ChevronDown className="size-4" />}
                            >
                                {reportingPeriodLabel}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Select reporting period"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={new Set([reportingPeriod])}
                            onAction={selectReportingPeriod}
                        >
                            {reportingPeriods.map((period) => (
                                <DropdownItem key={period.key}>{period.label}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {reportingPeriod === "custom" && (
                        <div className="relative w-full sm:w-[380px]">
                            <DateRangePicker
                                aria-label="Custom reporting date range"
                                className="w-full"
                                classNames={{
                                    inputWrapper: "h-10 rounded-lg border border-[#dbe3ef] bg-white shadow-none",
                                    input: customDateRangeLabel ? "opacity-0" : "",
                                    segment: "text-sm text-[#53627a]",
                                    separator: customDateRangeLabel ? "opacity-0" : "text-[#53627a]",
                                    selectorButton: "relative z-30 text-[#53627a]",
                                }}
                                granularity="day"
                                onChange={handleCustomDateRangeChange}
                            />
                            {customDateRangeLabel && (
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-px left-px right-10 z-20 flex items-center overflow-hidden rounded-l-lg bg-white px-3 whitespace-nowrap text-[13px] font-medium text-[#53627a]"
                                >
                                    {customDateRangeLabel}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Button
                as={Link}
                href={uri.create_invoice}
                className="h-[42px] rounded-lg bg-[#075de8] px-6 font-bold text-white shadow-[0_18px_30px_-20px_rgba(7,93,232,0.75)]"
                startContent={<Plus className="size-5" />}
            >
                Create New Invoice
            </Button>
        </div>
    );
}

function MetricGrid({metrics}: {metrics: DashboardMetric[]}) {
    return (
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
                <MetricCard key={metric.title} metric={metric} iconIndex={index} />
            ))}
        </section>
    );
}

function MetricCard({metric, iconIndex}: { metric: DashboardMetric; iconIndex: number }) {
    const Icon = metricIcons[iconIndex];
    const iconTone = [
        "bg-blue-50 text-[#075de8]",
        "bg-orange-50 text-orange-500",
        "bg-red-50 text-red-500",
        "bg-violet-50 text-violet-600",
    ][iconIndex];
    const trendTone =
        metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-500" : "text-slate-500";

    return (
        <Card shadow="none" className="rounded-lg border border-[#dbe3ef]">
            <CardBody className="flex-row items-center gap-4 p-4">
                <span className={`grid size-14 place-items-center rounded-xl ${iconTone}`}>
                    <Icon className="size-7" />
                </span>
                <div>
                    <p className="text-sm font-medium text-[#26364f]">{metric.title}</p>
                    <strong className="mt-1 block text-[22px] leading-none text-[#07142c]">{metric.value}</strong>
                    <p className={`mt-2 text-xs font-semibold ${trendTone}`}>{metric.change}</p>
                </div>
            </CardBody>
        </Card>
    );
}

function RevenueCard({data}: {data: RevenuePoint[]}) {
    return (
        <Card shadow="none" className="mt-4 rounded-lg border border-[#dbe3ef]">
            <CardBody className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-base font-extrabold text-[#07142c]">Revenue Overview</h2>
                    <div className="flex gap-3">
                        <Button variant="bordered" className="h-9 rounded-lg border-[#dbe3ef] text-xs font-bold text-[#075de8]">
                            View Report
                        </Button>
                    </div>
                </div>

                <RevenueChart data={data} />
            </CardBody>
        </Card>
    );
}

function RevenueChart({data}: { data: RevenuePoint[] }) {
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return (
            <div className="mt-4 grid h-[230px] place-items-center rounded-lg bg-[#f8fafc] text-sm text-[#53627a]">
                No revenue data is available for this period.
            </div>
        );
    }

    const width = Math.max(760, data.length * 82);
    const height = 190;
    const padding = {top: 18, right: 24, bottom: 34, left: 50};
    const values = data.map((item) => item.revenue);
    const highestValue = Math.max(...values);
    const maxValue = highestValue > 0 ? Math.ceil(highestValue / 1000) * 1000 : 1000;
    const minValue = 0;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const points = values.map((value, index) => {
        const x =
            data.length === 1
                ? padding.left + chartWidth / 2
                : padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        return {x, y};
    });
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const areaPath = `${path} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
    const gridValues = [maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0];
    const activePoint = activePointIndex === null ? null : data[activePointIndex];
    const activeCoordinates = activePointIndex === null ? null : points[activePointIndex];
    const tooltipWidth = 190;
    const tooltipHeight = 120;
    const tooltipX = activeCoordinates
        ? Math.min(
              Math.max(activeCoordinates.x - tooltipWidth / 2, padding.left),
              width - padding.right - tooltipWidth,
          )
        : 0;
    const tooltipY = activeCoordinates
        ? Math.max(4, Math.min(activeCoordinates.y - tooltipHeight - 10, height - tooltipHeight - 4))
        : 0;

    return (
        <div className="mt-4 w-full overflow-x-auto">
            <div className="relative h-[230px]" style={{minWidth: `${width}px`}}>
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="absolute inset-0 h-full w-full"
                    role="img"
                    aria-label="Revenue for the selected reporting period"
                    onPointerLeave={() => setActivePointIndex(null)}
                >
                    <defs>
                        <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#075de8" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#075de8" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {gridValues.map((value) => {
                        const y = padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
                        return (
                            <g key={value}>
                                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e8eef7" />
                                <text x={16} y={y + 4} fill="#53627a" fontSize="12">
                                    {value === 0 ? "$0" : `$${value / 1000}K`}
                                </text>
                            </g>
                        );
                    })}

                    <path d={areaPath} fill="url(#revenue-fill)" />
                    <path d={path} fill="none" stroke="#075de8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />

                    {data.map((point, index) => (
                        <circle key={point.month} cx={points[index].x} cy={points[index].y} r="4" fill="#ffffff" stroke="#075de8" strokeWidth="3" />
                    ))}

                    {data.map((point, index) => (
                        <text key={point.month} x={points[index].x} y={height - 8} textAnchor="middle" fill="#53627a" fontSize="12">
                            {point.month}
                        </text>
                    ))}

                    {data.map((point, index) => {
                        const leftEdge = index === 0 ? padding.left : (points[index - 1].x + points[index].x) / 2;
                        const rightEdge =
                            index === data.length - 1
                                ? width - padding.right
                                : (points[index].x + points[index + 1].x) / 2;

                        return (
                            <rect
                                key={`${point.month}-hover-area`}
                                aria-label={`View ${point.month} revenue details`}
                                fill="transparent"
                                height={chartHeight}
                                role="button"
                                tabIndex={0}
                                width={rightEdge - leftEdge}
                                x={leftEdge}
                                y={padding.top}
                                className="cursor-crosshair outline-none"
                                onBlur={() => setActivePointIndex(null)}
                                onFocus={() => setActivePointIndex(index)}
                                onPointerEnter={() => setActivePointIndex(index)}
                            />
                        );
                    })}

                    {activePoint && activeCoordinates && (
                        <>
                            <line
                                x1={activeCoordinates.x}
                                x2={activeCoordinates.x}
                                y1={padding.top}
                                y2={height - padding.bottom}
                                stroke="#075de8"
                                strokeDasharray="4 4"
                                strokeOpacity="0.28"
                            />
                            <circle
                                cx={activeCoordinates.x}
                                cy={activeCoordinates.y}
                                r="6"
                                fill="#ffffff"
                                stroke="#075de8"
                                strokeWidth="3"
                            />
                            <foreignObject
                                x={tooltipX}
                                y={tooltipY}
                                width={tooltipWidth}
                                height={tooltipHeight}
                                className="pointer-events-none overflow-visible"
                            >
                                <div className="rounded-lg border border-[#dbe3ef] bg-white p-3 text-xs text-[#53627a] shadow-[0_12px_30px_-12px_rgba(20,43,72,0.42)]">
                                    <p className="mb-1 font-bold text-[#07142c]">{activePoint.month}</p>
                                    <p>Revenue: {moneyFormatter.format(activePoint.revenue)}</p>
                                    <p>Invoices: {activePoint.invoices}</p>
                                    <p>Paid: {moneyFormatter.format(activePoint.paid)}</p>
                                    <p>Outstanding: {moneyFormatter.format(activePoint.outstanding)}</p>
                                    <p>Active clients: {activePoint.clients}</p>
                                </div>
                            </foreignObject>
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
}

function RecentInvoicesCard({invoices}: {invoices: RecentInvoice[]}) {
    return (
        <Card shadow="none" className="rounded-lg border border-[#dbe3ef]">
            <CardBody className="p-4">
                <CardHeading title="Recent Invoices" href={uri.invoices} />
                <div className="mt-3 overflow-x-auto">
                    <div className="min-w-[650px] divide-y divide-[#e8eef7]">
                        {invoices.map((invoice) => (
                            <div key={invoice.invoiceNumber} className="grid grid-cols-[24px_minmax(140px,1fr)_minmax(120px,0.9fr)_110px_90px_72px] items-center gap-3 py-2 text-sm">
                                <ReceiptText className="size-5 text-[#53627a]" />
                                <span className="font-medium text-[#07142c]">{invoice.invoiceNumber}</span>
                                <span className="text-[#53627a]">{invoice.client}</span>
                                <span className="text-[#53627a]">{invoice.date}</span>
                                <span className="text-[#53627a]">{invoice.amount}</span>
                                <span className={`justify-self-end rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${statusClasses[invoice.status]}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        ))}
                        {invoices.length === 0 && (
                            <p className="py-8 text-center text-sm text-[#53627a]">
                                No recent invoices for this period.
                            </p>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function TopClientsCard({clients}: {clients: TopClient[]}) {
    return (
        <Card shadow="none" className="rounded-lg border border-[#dbe3ef]">
            <CardBody className="p-4">
                <CardHeading title="Top Clients" href={uri.client.clients} />
                <div className="mt-3 divide-y divide-[#e8eef7]">
                    {clients.map((client) => (
                        <div key={client.name} className="flex items-center gap-3 py-3">
                            <span className="grid size-10 place-items-center rounded-full bg-[#edf2f9] text-sm font-bold text-[#53627a]">
                                {client.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#07142c]">{client.name}</p>
                                <p className="text-xs text-[#53627a]">{client.invoices} invoices</p>
                            </div>
                            <strong className="text-sm text-[#07142c]">{client.amount}</strong>
                        </div>
                    ))}
                    {clients.length === 0 && (
                        <p className="py-8 text-center text-sm text-[#53627a]">
                            No paid client activity for this period.
                        </p>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}

function SetupProgressCard() {
    return (
        <Card shadow="none" className="mt-4 rounded-lg border border-[#dbe3ef]">
            <CardBody className="p-4">
                <h2 className="text-base font-extrabold text-[#07142c]">Setup Progress</h2>
                <p className="mt-1 text-sm text-[#53627a]">Complete these steps to get the most out of Billifty.</p>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {setupProgress.map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                            <span className={`grid size-9 place-items-center rounded-full ${item.percent === 100 ? "bg-green-100 text-green-600" : "bg-blue-100 text-[#075de8]"}`}>
                                <Check className="size-5" />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#07142c]">{item.label}</p>
                                <p className="mt-1 text-xs text-[#53627a]">{item.description}</p>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="h-1.5 flex-1 rounded-full bg-[#edf2f9]">
                                        <span
                                            className={`block h-1.5 rounded-full ${item.percent === 100 ? "bg-green-500" : "bg-[#075de8]"}`}
                                            style={{width: `${item.percent}%`}}
                                        />
                                    </span>
                                    <span className="text-xs font-bold text-[#53627a]">{item.percent}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function MonthlySummaryCard() {
    return (
        <Card shadow="none" className="rounded-[14px] border border-[#dbe3ef]">
            <CardBody className="p-5">
                <h2 className="text-xl font-extrabold text-[#07142c]">This Month</h2>
                <div className="mt-4 space-y-4">
                    {monthlySummary.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                            <span className="text-[#53627a]">{item.label}</span>
                            <strong className="text-[#07142c]">{item.value}</strong>
                        </div>
                    ))}
                </div>
                <Link href={uri.invoices} className="mt-5 flex items-center justify-between border-t border-[#e8eef7] pt-4 text-sm font-bold text-[#075de8]">
                    View monthly report
                    <ChevronRight className="size-5 text-[#53627a]" />
                </Link>
            </CardBody>
        </Card>
    );
}

function CardHeading({title, href}: { title: string; href: string }) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#07142c]">{title}</h2>
            <Link href={href} className="text-xs font-bold text-[#075de8]">
                View all
            </Link>
        </div>
    );
}
