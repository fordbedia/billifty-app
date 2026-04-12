"use client"

import {BusinessProfileProvider} from "@/app/providers/BusinessProfileContext";
import RootLayout from "@/app/components/common/RootLayout";
import {Button, Card, CardBody, CardHeader, DateRangePicker, Input, Link} from "@heroui/react";
import TableData from "@/app/components/Table";
import {useBusinessProfile} from "@/app/providers/BusinessProfileContext";
import {useApp} from "@/app/providers/AppContext";
import DashboardSidebar from "@/app/app/component/DashboardSidebar";

function Component () {
	const {
		businessProfileData,
		businessProfilePage,
		setBusinessProfilePage,
		setSearch,
		handleSearchKeyDown,
	} = useBusinessProfile()
	const {
		planCapabilities
	} = useApp()

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
				switch(item.payment_information.payment_method){
					case 'bank_transfer':
						return 'Bank Transfer'
					case 'paypal':
						return 'PayPal';
					case 'stripe':
						return 'Stripe'
					case 'cash_app':
						return 'Cash App'
				}
				break;
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
											<p className="workspace-eyebrow">Brand & Billing Setup</p>
											<h3 className="text-3xl font-semibold">My Business Profile</h3>
											<h4 className="text-base font-extralight">Manage your business identity and payment settings.</h4>
											{/*<div className="mt-4">*/}
											{/*	<DateRangePicker className="max-w-xs" label="Stay duration" />*/}
											{/*</div>*/}
										</div>
										<div className="self-start lg:self-center workspace-actions">
											{((planCapabilities?.limits?.max_business_profiles === null) || (planCapabilities?.limits?.['current:businessProfiles'] < planCapabilities?.limits?.max_business_profiles)) && (
												<Button as={Link} href="/app/invoice/business-profile/new" color="primary" className="workspace-primary-btn">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
														<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
													</svg>
													Create New Business Profile</Button>
											)}

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

						<div className="md:w-1/5 w-full">
           		<DashboardSidebar />
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default function BusinessProfile() {
	return <BusinessProfileProvider>
		<Component />
	</BusinessProfileProvider>
}
