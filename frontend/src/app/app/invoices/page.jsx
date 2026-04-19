"use client"

import {InvoiceProvider} from "@/app/providers/InvoiceContext";
import RootLayout from "@/app/components/common/RootLayout";
import TableData from "@/app/components/Table";
import {Button, Card, CardBody, CardHeader, Divider, Link, Input} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import {useRouter} from "next/navigation";
import {Chip, Tooltip} from "@heroui/react";
import {formattedDate} from "@/app/utils/date";
import {DateRangePicker} from "@heroui/react";
import {useApp} from "@/app/providers/AppContext";
import DashboardSidebar from "@/app/app/component/DashboardSidebar";

const dashboardPrimaryButtonClass =
	"group h-auto min-h-[54px] rounded-[8px] bg-[#1d84c6] px-5 py-3 text-base font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

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
				if (string === 'issued') {
					color = 'secondary'
				} else if (string === 'sent') {
					color = 'primary'
				} else if (string === 'paid') {
					color = 'success'
				} else if (string === 'partially') {
					color = 'warning'
				} else if (string === 'void') {
					color = 'danger'
				}
				return <Chip color={color}>{status}</Chip>

		  case "client.name":
				return <>
					<div className="font-semibold">{item.client?.name ?? "—"}</div>
					<div className="font-extralight">{item.client.email}</div>
				</>

			case 'issued_on':
				return <>
						<div className="font-semibold">{formattedDate(item.issued_on)}</div>
						<div className="font-light">{formattedDate(item.due_on)}</div>
				</>

		  default:
				return item[columnKey] ?? "—";
			}
	  };

	// Actions column: Edit + Archive
  	const renderActions = (item) => (
		<div className="flex gap-2">
			<Tooltip content="Edit" showArrow={true}>
				<Button
					size="sm"
					variant="light"
					onPress={() => router.push(`/app/invoice/${item.id}`)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
					</svg>
				</Button>
			</Tooltip>
			<Tooltip content="Archive" showArrow={true}>
				<Button
					size="sm"
					color="danger"
					variant="light"
					onPress={() => {
						// handleArchive(item.id)
						console.log("Archive invoice", item.id);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
					</svg>
				</Button>
			</Tooltip>
		</div>
  	);
		return (
    <RootLayout isProtected>
      <div className="app app-wrapper min-h-screen bg-white dashboard-page">
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-10 sm:px-8 sm:pt-12 lg:pt-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="w-full md:w-4/5">
              <Card className="mb-5 border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]" fullWidth radius="sm">
                <CardHeader className="px-5 py-5 sm:px-6">
									<div className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
										<div className="workspace-title-wrap">
											<p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">Invoice Dashboard</p>
											<h3 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[48px]">My Invoices</h3>
											<h4 className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">Manage and track every invoice in one clean view.</h4>
											<div className="mt-5">
												<DateRangePicker className="max-w-xs" label="Date range" onChange={handleDateRangeChange} radius="sm" />
											</div>
										</div>
										<div className="w-full self-start lg:w-auto workspace-actions">
											{((planCapabilities?.limits?.max_invoices_per_month === null) || (planCapabilities?.limits?.['current:invoices'] < planCapabilities?.limits?.max_invoices_per_month)) && (
												<Button disableRipple onPress={() => {
													clearSticky()
													router.replace('/app/invoice/new')
												}} variant="flat" className={dashboardPrimaryButtonClass}>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 transition-transform duration-300 group-hover:rotate-90">
														<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
													</svg>
													Create New Invoice</Button>
												)}

												<div className="mt-4 w-full lg:w-72">
													<Input
														name="search"
														label="Search"
														placeholder="Search for client name or email"
														onValueChange={setSearch}
														onKeyDown={handleSearchKeyDown}
														radius="sm"
													/>
												</div>
										</div>
									</div>
                </CardHeader>
                <CardBody className="px-4 pb-5 pt-0 sm:px-6">
                  {userInvoices && userInvoices.data && userInvoices.data.length > 0 && (
                    <TableData
											classNames="invoice-table"
                      data={userInvoices.data}
                      column={column}
                      page={invoicePage}
                      totalPages={userInvoices.last_page ?? 1}
                      onPageChange={setInvoicePage}
                      renderCell={renderCell}
                      renderActions={renderActions}
                    />
                  )}
                </CardBody>
              </Card>
            </div>

						<div className="w-full md:w-1/5">
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
