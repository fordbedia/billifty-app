"use client"

import {ClientProvider} from "@/app/providers/ClientProvider";
import {Button, Card, CardBody, CardHeader, Input, Link} from "@heroui/react";
import RootLayout from "@/app/components/common/RootLayout";
import TableData from "@/app/components/Table";
import {useClient} from "@/app/providers/ClientProvider";
import DashboardSidebar from "@/app/app/component/DashboardSidebar";

function Component() {
	const {
		clients,
		clientPage,
		setClientPage,
		uri,
		handleSearchKeyDown,
		setSearch
	} = useClient()

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
			<div className="app app-wrapper outer-bg dashboard-page">
        <div className="m-auto max-w-screen-xl py-6 md:px-0 px-5">
          <div className="w-full flex md:flex-row flex-col mb-5 gap-4 items-start">
            <div className="md:w-4/5 w-full">
              <Card className="mb-5 px-3 py-4 workspace-card" fullWidth radius="sm">
                <CardHeader>
									<div className="w-full flex flex-col lg:flex-row justify-between content-center gap-4">
										<div className="workspace-title-wrap">
											<p className="workspace-eyebrow">Client Relationship Hub</p>
											<h3 className="text-3xl font-semibold">My Clients</h3>
											<h4 className="text-base font-extralight">Store client details and keep billing records organized.</h4>
											{/*<div className="mt-4">*/}
											{/*	<DateRangePicker className="max-w-xs" label="Stay duration" />*/}
											{/*</div>*/}
										</div>
										<div className="self-start lg:self-center workspace-actions">
											<Button as={Link} href={uri.client.create_client} color="primary" className="workspace-primary-btn">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
													<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
												</svg>
												Create New Client</Button>

												<div className="mt-4 w-64">
													<Input
														name="search"
														label="Search"
														placeholder="Search for business name or email"
														onValueChange={setSearch}
														onKeyDown={handleSearchKeyDown}
													/>
												</div>
										</div>
									</div>
                </CardHeader>
                <CardBody>
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

						<div className="md:w-1/5 w-full">
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
