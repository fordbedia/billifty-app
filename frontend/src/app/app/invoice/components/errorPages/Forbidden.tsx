import {Button, Card, CardBody, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";
import Image from "next/image";
import {useApp} from "@/app/providers/AppContext";

export default function Forbidden() {
	const {
		planCapabilities
	} = useApp()

	const isExceeded = (current: number, max: number): boolean => current >= max;

	return (
		<div className="error error-404 flex justify-center">
			<div className="box text-center justify-items-center my-12 py-8 px-12">

                <div className="rounded-full border-0 px-9 py-9 bg-red-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-red-800">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>

				<h2 className="text-8xl font-bold pt-5">403</h2>
				<h3 className="text-2xl font-bold">Access Denied</h3>
				<p className="text-xl py-4">You&#39;ve reached your plan&#39;s usage limit. Upgrade to continue creating professional invoices.</p>

				<div className="w-screen-xl flex justify-center flex-wrap">
				<Card className="m-w-[600px] rounded-md shadow-lg mt-5 mb-10 bg-red-50 border-1 border-red-300">
					<CardBody>
						<h2 className="text-red-700 flex flex-row gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
							</svg>
							Plan Limit Reached</h2>
						<div className="pl-8 pr-5">
							<p className="text-red-600">You&#39;ve exceeded the limits of your current plan. Here&#39;s what you&#39;ve used:</p>
							<ul className="pt-4">
								<li className={'flex flex-row py-1 justify-between flex-wrap ' + (isExceeded(planCapabilities?.limits?.['current:invoices'], planCapabilities?.limits?.max_invoices_per_month) ? ' text-red-600' : ' text-green-600') }>
									<div>Invoices this month:</div>
									<div>{planCapabilities?.limits?.['current:invoices']} / {planCapabilities?.limits?.max_invoices_per_month}</div>
								</li>
								<li className={'flex flex-row py-1 justify-between flex-wrap ' + (isExceeded(planCapabilities?.limits?.['current:businessProfiles'], planCapabilities?.limits?.max_business_profiles) ? ' text-red-600' : ' text-green-600')}>
									<div>Business profiles:</div>
									<div>{planCapabilities?.limits?.['current:businessProfiles']} / {planCapabilities?.limits?.max_business_profiles}</div>
								</li>
								<li className={'flex flex-row py-1 justify-between flex-wrap ' + (isExceeded(planCapabilities?.limits?.['current:clients'], planCapabilities?.limits?.max_clients) ? ' text-red-600' : ' text-green-600')}>
									<div>Active clients:</div>
									<div>{planCapabilities?.limits?.['current:clients']} / {planCapabilities?.limits?.max_clients}</div>
								</li>
							</ul>
						</div>
					</CardBody>
				</Card>
				</div>

				<div className="flex justify-center gap-5">
					<Button disableRipple as={Link} href={uri.h} variant="flat" className="px-9 py-7 bg-blue-700 text-white font-semibold">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
						</svg>
						Upgrade to Pro
					</Button>
					<Button disableRipple as={Link} href={uri.pricing} color="warning" variant="flat" className="px-9 py-7 bg-white text-black border-2 rounded-md border-gray-300 font-semibold">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
						  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
						View Pricing
					</Button>
				</div>

				<div className="py-7">
					<Button as={Link} href={uri.invoices} disableRipple variant="flat" className="px-7 py-7 text-blue-700 font-semibold">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
						Back to Dashboard</Button>
				</div>
			</div>
		</div>
	)
}