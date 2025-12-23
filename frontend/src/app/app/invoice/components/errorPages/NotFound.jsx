import {Button, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";
import Image from "next/image";

export default function NotFound() {
	return (
		<div className="error error-404 flex justify-center">
			<div className="box text-center justify-items-center my-12 py-8 px-12">
				<Image alt="Warning Icon" className="text-center my-8" priority quality={100} width={128} height={128} src="/images/warning-red.png" />
				<h2 className="text-8xl font-bold pt-5">404</h2>
				<h3 className="text-2xl">Invoice Not Found</h3>
				<p className="text-xl py-4">The invoice you're looking for doesn't exist or may have been deleted. Please check the URL or return to the dashboard.</p>

				<div className="flex justify-center">
					<Button as={Link} href={uri.h} color="primary" variant="flat" className="mx-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
						Home
					</Button>
					<Button as={Link} href={uri.create_invoice} color="warning" variant="flat" className="mx-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
						</svg>
						Create Invoice
					</Button>
				</div>
			</div>
		</div>
	)
}