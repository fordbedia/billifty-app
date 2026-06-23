"use client";

import Link from "next/link";
import {AlertTriangle, ArrowLeft, Gauge, ReceiptText, X} from "lucide-react";

import {uri} from "@/app/constants/routePaths";

export default function NotFound() {
	const handleGoBack = () => {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		window.location.href = uri.invoices;
	};

	return (
		<main className="min-h-[100dvh] w-full bg-[#f8faff] px-4 py-8 text-center text-[#172033] sm:px-6 sm:py-10">
			<section className="mx-auto flex w-full max-w-[620px] flex-col items-center">
				<div className="relative flex h-[96px] w-[96px] items-center justify-center rounded-[23px] bg-white shadow-[0_16px_28px_rgba(24,33,58,0.13),0_0_64px_rgba(99,86,238,0.14)] sm:h-[108px] sm:w-[108px]">
					<div className="relative flex h-[52px] w-[43px] items-center justify-center rounded-[8px] bg-[#dbe3ec] text-white shadow-[0_5px_8px_rgba(34,49,71,0.12)] sm:h-[56px] sm:w-[47px]">
						<ReceiptText aria-hidden="true" className="h-8 w-8 text-white/95" strokeWidth={2.4} />
						<span className="absolute left-3 top-3 h-1.5 w-5 rounded-full bg-white/75" />
						<span className="absolute bottom-4 left-3 h-3 w-7 rounded-[4px] border border-white/90 bg-[#f7f9fd]" />
					</div>
					<span className="absolute right-[25px] top-[24px] flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#ff3f4c] text-white shadow-[0_5px_12px_rgba(255,63,76,0.34)] sm:right-[28px] sm:top-[25px] sm:h-[31px] sm:w-[31px]">
						<X aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={3} />
					</span>
				</div>

				<h1 className="mt-9 bg-gradient-to-r from-[#544ded] via-[#626df1] to-[#9650ed] bg-clip-text text-[86px] font-black leading-none tracking-normal text-transparent sm:mt-10 sm:text-[112px]">
					404
				</h1>

				<h2 className="mt-5 text-[30px] font-black leading-tight tracking-normal text-[#172033] sm:text-[34px]">
					Invoice Not Found
				</h2>

				<div className="mt-5 flex items-center justify-center gap-4 text-[#d7dee8]">
					<span className="h-px w-[58px] bg-[#dfe4ec]" />
					<span className="h-2 w-2 rounded-full bg-[#d7dee8]" />
					<span className="h-px w-[58px] bg-[#dfe4ec]" />
				</div>

				<p className="mt-7 max-w-[500px] text-[18px] font-medium leading-[1.55] text-[#6d7a8c] sm:text-[20px]">
					The invoice you&apos;re looking for doesn&apos;t exist or may have been deleted. Please check the URL or return
					to the dashboard.
				</p>

				<div className="mt-9 flex w-full max-w-[526px] items-start gap-5 rounded-[18px] border border-[#f3dc76] bg-[#fffdf0] px-6 py-5 text-left shadow-[0_1px_0_rgba(255,255,255,0.8)] sm:px-8">
					<AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 fill-[#f6a21a] text-white" strokeWidth={2.5} />
					<p className="text-[16px] font-bold leading-[1.45] text-[#9e5517] sm:text-[17px]">
						If you believe this is an error, please contact your billing administrator or check with the invoice
						sender.
					</p>
				</div>

				<div className="mt-9 grid w-full max-w-[430px] grid-cols-1 gap-4 sm:max-w-[520px] sm:grid-cols-[1fr_178px] sm:gap-5">
					<Link
						href={uri.invoices}
						className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[14px] bg-[#5148ee] px-7 text-[18px] font-black text-white shadow-[0_12px_20px_rgba(81,72,238,0.25)] transition-opacity hover:opacity-95"
					>
						<Gauge aria-hidden="true" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
						Go to My Invoices
					</Link>
					<button
						type="button"
						onClick={handleGoBack}
						className="inline-flex h-[56px] items-center justify-center gap-4 rounded-[14px] border border-[#dfe3ea] bg-white px-7 text-[18px] font-black text-[#293244] shadow-[0_4px_10px_rgba(22,31,49,0.08)] transition-colors hover:bg-[#fafbff]"
					>
						<ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2.8} />
						Go Back
					</button>
				</div>

				<p className="mt-10 text-[14px] font-medium text-[#9aa6b6]">
					Error code:{" "}
					<code className="rounded-md bg-[#f2f5fa] px-3 py-1 font-mono text-[15px] font-bold text-[#6a7280]">
						INV-404-NOT-FOUND
					</code>
				</p>
			</section>
		</main>
	);
}
