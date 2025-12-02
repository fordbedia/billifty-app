"use client"

import {Button} from "@heroui/react";

export default function CongratsScreen({ invoice, options, footer }) {
	return (
		<div className="congrats-page flex justify-center flex-col items-center gap-4 py-5 my-5">
			<div className="check-icon pb-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			</div>
			<h2 className="text-5xl font-bold subpixel-antialiased pb-4">Congratulations!</h2>
			<p className="text-lg antialiased pb-7">Your invoice has been successfully processed and sent. Here's what happened:</p>

			<div className="max-w-screen-lg rounded-md px-5 py-8 border-1 border-green-800 bg-green-50">

				{options.selectedOption === 'sendCopyToMe' && (
					<>
						<div className="flex items-center gap-3 pb-6">
							<div className="small-icon self-baseline bg-green-600 rounded-full p-2 text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
								</svg>
							</div>
							<div>
								<h2 className="text-base font-bold subpixel-antialiased">Email Sent Successfully</h2>
								<p className="text-base font-extralight subpixel-antialiased">A copy of invoice #{invoice?.invoice_number} has been sent to your email {invoice?.business_profile?.email}</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-6">
							<div className="small-icon self-baseline bg-green-600 rounded-full p-2 text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
								</svg>
							</div>
							<div>
								<h2 className="text-base font-bold subpixel-antialiased">PDF Generated</h2>
								<p className="text-base font-extralight subpixel-antialiased">High-quality PDF created and attached to the email</p>
							</div>
						</div>
					</>
				)}

				{options.selectedOption === 'directSendToClient' && (
					<>
						<div className="flex items-center gap-3 pb-6">
							<div className="small-icon self-baseline bg-green-600 rounded-full p-2 text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
								</svg>
							</div>
							<div>
								<h2 className="text-base font-bold subpixel-antialiased">Email Sent Successfully</h2>
								<p className="text-base font-extralight subpixel-antialiased">A copy of invoice #{invoice?.invoice_number} has been sent to {invoice?.client?.email}</p>
							</div>
						</div>
					</>
				)}
				{options.selectedOption === 'downloadPdf' && (
					<>
						<div className="flex items-center gap-3 pb-6">
							<div className="small-icon self-baseline bg-green-600 rounded-full p-2 text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
								</svg>
							</div>
							<div>
								<h2 className="text-base font-bold subpixel-antialiased">PDF Generated</h2>
								<p className="text-base font-extralight subpixel-antialiased">High-quality PDF created</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-6">
							<div className="small-icon self-baseline bg-green-600 rounded-full p-2 text-white">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
								</svg>
							</div>
							<div>
								<h2 className="text-base font-bold subpixel-antialiased">PDF Downloaded</h2>
								<p className="text-base font-extralight subpixel-antialiased">A PDF was automatically downloaded to your desktop</p>
							</div>
						</div>
					</>
				)}

			</div>
			{footer}
		</div>
	)
}