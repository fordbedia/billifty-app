"use client"

import {InvoiceProvider} from "@/app/providers/InvoiceContext";
import RootLayout from "@/app/components/common/RootLayout";
import TableData from "@/app/components/Table";
import {Button, Card, CardBody, CardHeader, Link, Input} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {useRouter} from "next/navigation";
import {Chip, Tooltip} from "@heroui/react";
import {formattedDate} from "@/app/utils/date";
import {DateRangePicker} from "@heroui/react";
import {useApp} from "@/app/providers/AppContext";
import DashboardSidebar from "@/app/app/component/DashboardSidebar";
import {Pencil, Plus, Search, Trash2} from "lucide-react";

const dashboardPrimaryButtonClass =
	"group h-11 min-h-11 rounded-[7px] bg-[#075de8] px-6 text-[15px] font-semibold tracking-normal text-white shadow-[0_14px_24px_-18px_rgba(7,93,232,0.85)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#034fc9] hover:shadow-[0_18px_30px_-20px_rgba(7,93,232,0.9)] focus-visible:ring-2 focus-visible:ring-[#75b7ff] focus-visible:ring-offset-2";

function Component() {
	const {
		userInvoices,
		invoicePage,
		setInvoicePage,
		clearSticky,
		handleDateRangeChange,
		handleSearchKeyDown,
		setSearch,
	} = useInvoice()
	const {
		planCapabilities
	} = useApp();

	const router = useRouter()
	const column = [
		{key: 'invoice_number', label: 'Invoice #', allowsSorting: true},
		{key: 'currency.code', label: 'Currency', allowsSorting: true},
		{key: 'client.name', label: 'Client', allowsSorting: true},
		{key: 'total_cents', label: 'Amount', allowsSorting: true},
		{key: 'status', label: 'Status', allowsSorting: true},
		{key: 'issued_on', label: 'Issue Date', allowsSorting: true}
	]
	const renderCell = (item, columnKey) => {
		switch (columnKey) {
		  case "invoice_number":
			// Clickable Invoice # -> /app/invoice/{id}
			return (
			  <Link
					href={`/app/invoice/${item.id}`}
					className="text-primary underline hover:opacity-80"
			  >
					{item.invoice_number ?? `#${item.id}`}
			  </Link>
			);

			case 'currency.code':
				return item.currency.code

		  case "total_cents":
			// Example formatting amount
			return `${item.currency.symbol}${((item.total_cents ?? 0) / 100).toFixed(2)}`;

			case 'status':
				const string = item.status
				const status = string.charAt(0).toUpperCase() + string.slice(1)
				let color = 'default'
				let statusClass = "bg-[#eef1f5] text-[#3d4655] border border-[#d2d8e2]"
				if (string === 'issued') {
					color = 'secondary'
					statusClass = "bg-[#6d31d6] text-white"
				} else if (string === 'sent') {
					color = 'primary'
					statusClass = "bg-[#e6f0ff] text-[#075de8]"
				} else if (string === 'paid') {
					color = 'success'
					statusClass = "bg-[#e8f7ef] text-[#14804a]"
				} else if (string === 'partially') {
					color = 'warning'
					statusClass = "bg-[#fff4d8] text-[#9a6500]"
				} else if (string === 'void') {
					color = 'danger'
					statusClass = "bg-[#fff0f0] text-[#de1f31]"
				}
				return (
					<Chip
						color={color}
						variant="flat"
						className={`min-w-[74px] justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${statusClass}`}
					>
						{status}
					</Chip>
				)

		  case "client.name":
				return <>
					<div className="text-sm font-semibold text-[#07142c]">{item.client?.name ?? "—"}</div>
					<div className="mt-0.5 text-xs font-normal text-[#66738a]">{item.client?.email ?? ""}</div>
				</>

			case 'issued_on':
				return <>
						<div className="text-sm font-semibold text-[#07142c]">{formattedDate(item.issued_on)}</div>
						<div className="mt-0.5 text-xs font-normal text-[#66738a]">{formattedDate(item.due_on)}</div>
				</>

		  default:
				return item[columnKey] ?? "—";
			}
	  };

	// Actions column: Edit + Archive
  	const renderActions = (item) => (
		<div className="flex items-center gap-3">
			<Tooltip content="Edit" showArrow={true}>
				<Button
					isIconOnly
					aria-label={`Edit invoice ${item.invoice_number ?? item.id}`}
					className="h-9 w-9 min-w-9 rounded-[8px] border border-[#d9e1ec] bg-white text-[#101828] shadow-none hover:border-[#b8c6d8] hover:bg-[#f8fafc]"
					variant="bordered"
					onPress={() => router.push(`/app/invoice/${item.id}`)}
				>
					<Pencil className="size-4" strokeWidth={2} />
				</Button>
			</Tooltip>
			<Tooltip content="Archive" showArrow={true}>
				<Button
					isIconOnly
					aria-label={`Archive invoice ${item.invoice_number ?? item.id}`}
					className="h-9 w-9 min-w-9 rounded-[8px] border border-[#ffcfd2] bg-white text-[#f3123c] shadow-none hover:border-[#ff9da5] hover:bg-[#fff7f7]"
					variant="bordered"
					onPress={() => {
						// handleArchive(item.id)
						console.log("Archive invoice", item.id);
					}}
				>
					<Trash2 className="size-4" strokeWidth={2.1} />
				</Button>
			</Tooltip>
		</div>
  	);
		return (
    <RootLayout isProtected>
      <div className="app app-wrapper min-h-screen dashboard-page invoice-dashboard-page">
        <div className="invoice-dashboard-shell">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="w-full min-w-0">
              <Card className="invoice-workspace-card" fullWidth shadow="none">
                <CardHeader className="invoice-workspace-header">
									<div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
										<div className="workspace-title-wrap">
											<p className="text-sm font-semibold uppercase leading-none tracking-normal text-[#075de8]">Invoice Dashboard</p>
											<h1 className="mt-4 text-[32px] font-bold leading-none tracking-normal text-[#07142c] sm:text-[42px]">My Invoices</h1>
											<p className="mt-3 text-base font-normal leading-6 text-[#5c6982]">Manage and track every invoice in one clean view.</p>
										</div>
										<div className="w-full self-start lg:w-auto">
											{((planCapabilities?.limits?.max_invoices_per_month === null) || (planCapabilities?.limits?.['current:invoices'] < planCapabilities?.limits?.max_invoices_per_month)) && (
												<Button disableRipple onPress={() => {
													clearSticky()
													router.replace('/app/invoice/new')
												}} variant="flat" className={dashboardPrimaryButtonClass}>
													<Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2} />
													Create New Invoice</Button>
												)}
										</div>
									</div>
                </CardHeader>
                <CardBody className="invoice-workspace-body">
									<div className="invoice-filter-grid">
										<DateRangePicker
											className="invoice-filter-control"
											classNames={{
												inputWrapper: "h-[60px] rounded-[8px] border border-[#dbe3ef] bg-white px-5 shadow-none",
												label: "text-[13px] font-semibold text-[#18243a]",
												segment: "text-[15px] text-[#5f6d84]",
												selectorButton: "text-[#53627a]",
											}}
											label="Date range"
											onChange={handleDateRangeChange}
											radius="sm"
											variant="bordered"
										/>
										<Input
											className="invoice-filter-control"
											classNames={{
												inputWrapper: "h-[60px] rounded-[8px] border border-[#dbe3ef] bg-white px-5 shadow-none",
												label: "text-[13px] font-semibold text-[#18243a]",
												input: "text-[15px] text-[#5f6d84] placeholder:text-[#5f6d84]",
											}}
											name="search"
											label="Search"
											placeholder="Search for client name or email"
											onValueChange={setSearch}
											onKeyDown={handleSearchKeyDown}
											radius="sm"
											startContent={<Search className="mr-3 size-5 text-[#4d5d77]" strokeWidth={2} />}
											variant="bordered"
										/>
									</div>
                  {userInvoices && userInvoices.data && userInvoices.data.length > 0 && (
                    <TableData
											classNames="invoice-table invoice-dashboard-table"
                      data={userInvoices.data}
                      column={column}
                      page={invoicePage}
                      totalPages={userInvoices.last_page ?? 1}
                      onPageChange={setInvoicePage}
                      renderCell={renderCell}
                      renderActions={renderActions}
											tableClassNames={{
												wrapper: "min-h-[292px] rounded-[8px] border border-[#dbe3ef] bg-white p-0 shadow-none",
												th: "h-[54px] bg-white px-5 text-[13px] font-semibold text-[#17233a]",
												td: "border-t border-[#edf1f6] px-5 py-4 text-sm font-normal text-[#17233a]",
												tbody: "[&>tr:last-child>td]:border-b-0",
											}}
                    />
                  )}
									{(!userInvoices || !userInvoices.data || userInvoices.data.length === 0) && (
										<div className="invoice-empty-state">
											<h2>No invoices yet</h2>
											<p>Create your first invoice to start tracking clients, payment status, and due dates.</p>
										</div>
                  )}
                </CardBody>
              </Card>
            </div>

						<div className="w-full min-w-0">
           		<DashboardSidebar />
						</div>

          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default function Invoices() {
	return (
		<InvoiceProvider mode="list">
			<Component />
		</InvoiceProvider>
	);
}
