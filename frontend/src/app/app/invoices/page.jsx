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
      <div className="app app-wrapper outer-bg dashboard-page">
        <div className="m-auto max-w-screen-xl py-6 md:px-0 px-5">
          <div className="flex md:flex-row flex-col mb-5 gap-4 items-start">
            <div className="md:w-4/5 w-full">
              <Card className="mb-5 px-3 py-4 workspace-card" fullWidth radius="sm">
                <CardHeader>
									<div className="w-full flex flex-col lg:flex-row justify-between content-center gap-4">
										<div className="workspace-title-wrap">
											<p className="workspace-eyebrow">Invoice Dashboard</p>
											<h3 className="text-3xl font-semibold">My Invoices</h3>
											<h4 className="text-base font-extralight">Manage and track every invoice in one clean view.</h4>
											<div className="mt-4">
												<DateRangePicker className="max-w-xs" label="Date range" onChange={handleDateRangeChange} />
											</div>
										</div>
										<div className="self-start lg:self-center workspace-actions">
											{planCapabilities?.limits?.['current:invoices'] < planCapabilities?.limits?.max_invoices_per_month && (
												<Button disableRipple onPress={() => {
													clearSticky()
													router.replace('/app/invoice/new')
												}} color="primary" variant="flat" className="workspace-primary-btn">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
														<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
													</svg>
													Create New Invoice</Button>
												)}

												<div className="mt-4 w-64">
													<Input
														name="search"
														label="Search"
														placeholder="Search for client name or email"
														onValueChange={setSearch}
														onKeyDown={handleSearchKeyDown}
													/>
												</div>
										</div>
									</div>
                </CardHeader>
                <CardBody>
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

						<div className="md:w-1/5 w-full">
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
