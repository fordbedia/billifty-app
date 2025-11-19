"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Button, Card, CardBody, CardHeader, DateRangePicker, Input, Link} from "@heroui/react";
import TableData from "@/app/components/Table";
import {useBusinessProfile} from "@/app/providers/BusinessProfileContext";

export default function BusinessProfile () {
	const {
		businessProfileData,
		businessProfilePage,
		setBusinessProfilePage,
		setSearch,
		handleSearchKeyDown,
	} = useBusinessProfile()

	const column = [
		{key: 'name', label: 'Business Name'},
		{key: 'email', label: 'Email'},
		{key: 'payment_information.payment_method', label: 'Payment Method'}
	]

	const renderCell = (item, columnKey) => {
		switch (columnKey) {
		  case "name":
				return (
					<Link href={`/app/invoice/business-profile/${item.id}`}>{item.name}</Link>
				)

			case 'payment_information.payment_method':
				return item.payment_information.payment_method ?? "--"

		  default:
				return item[columnKey] ?? "—";
			}
	  };

	return (
		<RootLayout>
			<div className="app app-wrapper outer-bg">
        <div className="m-auto max-w-screen-xl py-5">
          <div className="w-full flex mb-5 gap-4">
            <div className="w-full">
              <Card className="mb-5 px-3 py-3" fullWidth radius="sm">
                <CardHeader>
									<div className="w-full flex justify-between content-center">
										<div>
											<h3 className="text-3xl font-semibold">My Business Profile</h3>
											{/*<div className="mt-4">*/}
											{/*	<DateRangePicker className="max-w-xs" label="Stay duration" />*/}
											{/*</div>*/}
										</div>
										<div className="self-center">
											<Button as={Link} href="/app/invoice/business-profile/new" color="primary">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
													<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
												</svg>
												Create New Business Profile</Button>

												<div className="mt-4 w-64">
													<Input
														name="search"
														label="Search"
														placeholder="Search for business name or email"
														onValueChange={(v) => setSearch(v)}
														onKeyDown={handleSearchKeyDown}
													/>
												</div>
										</div>
									</div>
                </CardHeader>
                <CardBody>
                  {businessProfileData && businessProfileData.data && businessProfileData.data.length > 0 && (
                    <TableData
											classNames="invoice-table"
                      data={businessProfileData.data}
                      column={column}
                      page={businessProfilePage}
                      totalPages={businessProfileData.last_page ?? 1}
                      onPageChange={setBusinessProfilePage}
                      renderCell={renderCell}
                    />
                  )}
                </CardBody>
              </Card>
            </div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}