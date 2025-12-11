"use client"

import RootLayout from "@/app/components/common/RootLayout";
import Image from "next/image";
import {Button, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

export default function App () {
	return (
		<RootLayout isProtected={false}>
			<div className="max-w-screen-xl m-auto my-20">
				<div className="flex w-full mx-12">
					<div className="w-1/2">
						<h2 className="text-5xl font-bold mb-9">Create Professional Invoices in Minutes</h2>

						<p className="text-base font-light">Get started with our intuitive invoice generator. Choose from beautiful templates, customize colors, and send professional invoices to your clients instantly.</p>
						<ul className="mt-5 space-y-6">
							<li className="flex items-start gap-4">
								<Image src="/images/pdf-blue-icon.png" width={48} height={48} alt="" />
								<div>
									<h2 className="text-base font-bold">Easy Invoice Creation</h2>
									<p className="text-base">
										Add, edit, and remove items with a simple interface designed for speed and efficiency.
									</p>
								</div>
							</li>

							<li className="flex items-start gap-4">
								<Image src="/images/paint-purple-icon.png" width={48} height={48} alt="" />
								<div>
									<h2 className="text-base font-bold">Beautiful Templates</h2>
									<p className="text-base">
										Select from professionally designed templates and customize with your brand colors.
									</p>
								</div>
							</li>

							<li className="flex items-start gap-4">
								<Image src="/images/lightning-green-icon.png" width={48} height={48} alt="" />
								<div>
									<h2 className="text-base font-bold">Instant Generation</h2>
									<p className="text-base">
										Generate and download your invoices instantly in PDF format, ready to send.
									</p>
								</div>
							</li>
						</ul>

						<div className="flex mt-9">
							<Button as={Link} href={uri.auth} disableRipple className="mr-3 px-9" color="primary">Let's Go!</Button>
							<Button disableRipple className="mr-3 px-9" color="default" value="flat">Pricing</Button>
						</div>

					</div>
					<div className="w-1/2">
						<Image src="/images/inv-preview.png" width={683} height={680} />
					</div>
				</div>
			</div>
		</RootLayout>
	)
}