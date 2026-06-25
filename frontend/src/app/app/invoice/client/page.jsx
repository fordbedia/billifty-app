"use client"

import {ClientProvider} from "@/app/providers/ClientProvider";
import {Button, Card, CardBody, CardHeader, Input, Link} from "@heroui/react";
import RootLayout from "@/app/components/common/RootLayout";
import TableData from "@/app/components/Table";
import {useClient} from "@/app/providers/ClientProvider";
import {useApp} from "@/app/providers/AppContext";
import DashboardSidebar from "@/app/app/component/DashboardSidebar";

const dashboardPrimaryButtonClass =
	"group h-auto min-h-[30px] rounded-[8px] bg-[#1d84c6] px-6 py-2 text-sm font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

function Component() {
	const {
		clients,
		clientPage,
		setClientPage,
		uri,
		handleSearchKeyDown,
		setSearch
	} = useClient()
	const {userData: me} = useApp()
	const clientLimit = me?.plan_capabilities?.limits?.max_clients;
	const currentClients = me?.plan_capabilities?.limits?.['current:clients'];
	const canCreateClient = clientLimit === null
		|| (typeof clientLimit === "number" && typeof currentClients === "number" && currentClients < clientLimit);

	const column = [
		{key: 'name', label: 'Business Name'},
		{key: 'company', label: 'Company'},
		{key: 'email', label: 'Email'}
	]

	const renderCell = (item, columnKey) => {
		switch (columnKey) {
		  case "name":
				return (
					<Link href={`/app/invoice/client/${item.id}`}>{item.name}</Link>
				)

		  default:
				return item[columnKey] ?? "—";
			}
	  };

	return (
		<RootLayout>
			<div className="app app-wrapper min-h-screen bg-white dashboard-page">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-10 sm:pt-12 lg:pt-16">
          <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="w-full min-w-0">
              <Card className="mb-5 border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]" fullWidth radius="sm">
                <CardHeader className="px-5 py-5 sm:px-6">
									<div className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
										<div className="workspace-title-wrap">
											<p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">Client Relationship Hub</p>
											<h3 className="mt-3 text-[30px] font-light leading-tight tracking-normal text-[#202020] sm:text-[38px]">My Clients</h3>
											<h4 className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">Store client details and keep billing records organized.</h4>
											{/*<div className="mt-4">*/}
											{/*	<DateRangePicker className="max-w-xs" label="Stay duration" />*/}
											{/*</div>*/}
										</div>
										<div className="w-full self-start lg:w-auto workspace-actions">
											{canCreateClient && (
												<Button as={Link} href={uri.client.create_client} className={dashboardPrimaryButtonClass}>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 transition-transform duration-300 group-hover:rotate-90">
														<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
													</svg>
													Create New Client</Button>
												)}

												<div className="mt-4 w-full lg:w-72">
													<Input
														name="search"
														label="Search"
														placeholder="Search for business name or email"
														onValueChange={setSearch}
														onKeyDown={handleSearchKeyDown}
														radius="sm"
													/>
												</div>
										</div>
									</div>
                </CardHeader>
                <CardBody className="px-4 pb-5 pt-0 sm:px-6">
                  {clients && clients.data && clients.data.length > 0 && (
                    <TableData
											classNames="invoice-table"
                      data={clients.data}
                      column={column}
                      page={clientPage}
                      totalPages={clients.last_page ?? 1}
                      onPageChange={setClientPage}
                      renderCell={renderCell}
                    />
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
	)
}

export default function ClientsApp() {
	return (
		<ClientProvider>
			<Component />
		</ClientProvider>
	)
}
