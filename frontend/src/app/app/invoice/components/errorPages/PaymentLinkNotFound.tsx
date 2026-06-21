import Link from "next/link";
import {
	AlertTriangle,
	Ban,
	Clock3,
	Headphones,
	Home,
	Info,
	Mail,
	RefreshCw,
	Unlink,
    Banknote,
	X,
} from "lucide-react";

import {uri} from "@/app/constants/routePaths";

const reasons = [
	// {
	// 	title: "Expired",
	// 	description: "Link validity period has ended",
	// 	icon: Clock3,
	// 	iconClassName: "bg-amber-50 text-amber-500",
	// },
    {
		title: "Paid",
		description: "An invoice has been paid",
		icon: Banknote,
		iconClassName: "bg-sky-50 text-green-400",
	},
	{
		title: "Revoked",
		description: "Sender has cancelled this link",
		icon: Ban,
		iconClassName: "bg-rose-50 text-rose-400",
	},
	{
		title: "Renewed",
		description: "A newer link has replaced this one",
		icon: RefreshCw,
		iconClassName: "bg-sky-50 text-sky-500",
	},
];

export default function PaymentLinkNotFound() {
	return (
		<main className="min-h-screen bg-[#f7f9fc] px-5 py-16 text-[#172033]">
			<div className="mx-auto flex w-full max-w-[880px] flex-col items-center">
				<section className="grid w-full max-w-[710px] grid-cols-1 items-center gap-10 md:grid-cols-[190px_1fr] md:gap-12">
					<div className="flex flex-col items-center gap-6 md:pt-24">
						<div className="relative flex h-[152px] w-[152px] items-center justify-center rounded-full bg-[#e9eef5] shadow-[inset_0_1px_5px_rgba(20,35,58,0.08)]">
							<span className="absolute left-2 top-[128px] h-4 w-4 rounded-full bg-[#ffdb55]" />
							<span className="absolute right-2 top-3 h-4 w-4 rounded-full bg-[#ffb9c2]" />
							<span className="absolute -right-2 top-[74px] h-3 w-3 rounded-full bg-[#c7d0ff]" />
							<div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full border border-[#d9e0ea] bg-white shadow-[0_12px_22px_rgba(33,45,68,0.13)]">
								<Unlink
									aria-hidden="true"
									className="h-[58px] w-[58px] rotate-[-8deg] text-[#b9c6d3]"
									strokeWidth={2.4}
								/>
								<span className="absolute right-[18px] top-[30px] flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5b6b] text-white shadow-sm">
									<X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
								</span>
							</div>
						</div>

						<div className="inline-flex items-center gap-2 rounded-full border border-[#fac8d3] bg-[#fff4f6] px-4 py-2 text-[13px] font-semibold text-[#e13f55] shadow-sm">
							<span className="h-2 w-2 rounded-full bg-[#ef4858]" />
							Link Unavailable
						</div>
					</div>

					<div>
						<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e0e5ff] bg-[#f0f3ff] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#625fe6]">
							<AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
							Error · Payment Link Invalid
						</div>

						<h1 className="max-w-[425px] text-[45px] font-black leading-[0.93] tracking-normal text-[#151f2f] sm:text-[52px]">
							This payment link is no longer{" "}
							<span className="text-[#6857f6]">active.</span>
						</h1>

						<p className="mt-6 max-w-[540px] text-[17px] leading-7 text-[#667487]">
							The payment link you&apos;re trying to access has either{" "}
							<strong className="font-extrabold text-[#2b3442]">paid</strong>, been{" "}
							<strong className="font-extrabold text-[#2b3442]">revoked</strong>, or is no longer valid.
							Please reach out to the person who sent you this link to request a new one.
						</p>

						<div className="mt-8 grid gap-3 sm:grid-cols-3">
							{reasons.map(({title, description, icon: Icon, iconClassName}) => (
								<div
									key={title}
									className="min-h-[116px] rounded-lg border border-[#e3e7ee] bg-white px-4 py-5 shadow-[0_3px_8px_rgba(22,31,49,0.04)]"
								>
									<div className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${iconClassName}`}>
										<Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
									</div>
									<h2 className="text-[14px] font-extrabold text-[#222b3a]">{title}</h2>
									<p className="mt-1 text-[12px] font-medium leading-5 text-[#8a96a8]">{description}</p>
								</div>
							))}
						</div>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								href={uri.contact_message}
								className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5a6bf6] to-[#a517e6] px-6 text-[15px] font-extrabold text-white shadow-[0_10px_18px_rgba(92,65,226,0.27)]"
							>
								<Mail aria-hidden="true" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
								Contact the Recipient
							</Link>
							<Link
								href={uri.h}
								className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#dfe4eb] bg-white px-6 text-[15px] font-extrabold text-[#586474] shadow-[0_3px_8px_rgba(22,31,49,0.05)]"
							>
								<Home aria-hidden="true" className="h-4 w-4 text-[#9ba7b7]" fill="currentColor" strokeWidth={0} />
								Go to Homepage
							</Link>
						</div>
					</div>
				</section>

				<section className="mt-24 flex w-full flex-col items-start gap-5 rounded-xl border border-[#e1e6ee] bg-white px-7 py-7 shadow-[0_4px_10px_rgba(22,31,49,0.04)] sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-start gap-6">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f1ff] text-[#6b64e8]">
							<Info aria-hidden="true" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
						</div>
						<div>
							<h2 className="text-[16px] font-extrabold text-[#2b3442]">Need help with your payment?</h2>
							<p className="mt-2 max-w-[650px] text-[13px] font-medium leading-6 text-[#7c8899]">
								If you believe this is a mistake or need further assistance, our support team is here to help.
								You can also verify with the sender that they&apos;ve issued the correct link.
							</p>
						</div>
					</div>

					<Link
						href={uri.contact_message}
						className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#cac8f7] bg-[#f5f3ff] px-5 text-[14px] font-extrabold text-[#6b5de5]"
					>
						<Headphones aria-hidden="true" className="h-4 w-4" />
						Get Support
					</Link>
				</section>
			</div>
		</main>
	);
}
