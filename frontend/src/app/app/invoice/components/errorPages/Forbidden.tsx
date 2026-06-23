import Link from "next/link";
import {
	ArrowLeft,
	BarChart3,
	Building2,
	Check,
	Info,
	ReceiptText,
	Sparkles,
	Tag,
	Users,
    Infinity,
} from "lucide-react";

import {uri} from "@/app/constants/routePaths";
import {useApp} from "@/app/providers/AppContext";
import {useUser} from "@/app/providers/UserContext";

type UsageItem = {
	title: string;
	current?: number;
	max?: number;
	icon: typeof ReceiptText;
	isPrimary?: boolean;
};

export default function Forbidden() {
	const {planCapabilities} = useApp();
    const {me} = useUser()
	const limits = planCapabilities?.limits;

	const usageItems: UsageItem[] = [
		{
			title: "Invoices this month",
			current: limits?.["current:invoices"],
			max: limits?.max_invoices_per_month,
			icon: ReceiptText,
			isPrimary: true,
		},
		{
			title: "Business profiles",
			current: limits?.["current:businessProfiles"],
			max: limits?.max_business_profiles,
			icon: Building2,
		},
		{
			title: "Active clients",
			current: limits?.["current:clients"],
			max: limits?.max_clients,
			icon: Users,
		},
	];

    const upgradeLabel = () => {
        if(me?.subscription?.plan?.code === "free") return "Upgrade to Pro"

        return "Upgrade to Premium"
    }

	const formatValue = (value?: number) => {
        if (value === null || value === 0) {
            return <Infinity />;
        }
        return value;
    };
	const getPercent = (current?: number, max?: number) => {
		if (!max || max <= 0) return 0;
		return Math.min(100, Math.max(0, ((current ?? 0) / max) * 100));
	};
	const isExceeded = (current?: number, max?: number) => Boolean(max && (current ?? 0) >= max);

	return (
		<main
			className="min-h-[100dvh] w-full px-4 py-10 text-[#293244] sm:px-6"
			style={{backgroundColor: "#eef4ff"}}
		>
			<section className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[18px] bg-white shadow-[0_14px_34px_rgba(91,105,140,0.16)]">
				<div
					className="relative overflow-hidden px-5 py-8 text-white sm:px-10"
					style={{backgroundColor: "#5148ee"}}
				>
					<div className="absolute right-[-54px] top-[-78px] h-[220px] w-[220px] rounded-full bg-white/10" />
					<div className="absolute right-[20px] top-[-34px] h-[156px] w-[156px] rounded-full bg-white/10" />

					<div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
						<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
							<BarChart3 aria-hidden="true" className="h-6 w-6" strokeWidth={2.7} />
						</div>
						<div>
							<h1 className="text-[24px] font-extrabold leading-tight tracking-normal sm:text-[26px]">
								Plan Limit Reached
							</h1>
							<p className="mt-2 max-w-[570px] text-[15px] font-medium leading-7 text-white/75 sm:text-[18px]">
								You&apos;ve reached your current plan&apos;s monthly creation limit. Upgrade to continue
								creating invoices, business profiles, and clients.
							</p>
						</div>
					</div>
				</div>

				<div className="px-5 pb-8 pt-8 sm:px-10">
					<div className="mb-6 flex items-center justify-between gap-4">
						<h2 className="text-[18px] font-extrabold uppercase tracking-[0.04em] text-[#323c4b]">
							Current Usage
						</h2>
						<span className="rounded-full border border-[#e8e8fb] bg-[#f3f3ff] px-4 py-1.5 text-[14px] font-bold text-[#5148b9] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
							{`${me?.subscription?.plan?.name} Plan`}
						</span>
					</div>

					<div className="space-y-4">
						{usageItems.map(({title, current, max, icon: Icon, isPrimary}) => {
							const exceeded = isExceeded(current, max);
							const percent = getPercent(current, max);

							return (
								<div
									key={title}
									className={`rounded-[14px] border px-5 py-5 ${
										isPrimary || exceeded
											? "border-[#f3e7a6] bg-[#fffdf0]"
											: "border-[#e4e7ed] bg-[#fafbfe]"
									}`}
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex min-w-0 items-center gap-3">
											<div
												className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] ${
													isPrimary || exceeded
														? "bg-[#fff4cb] text-[#d48a08]"
														: "bg-[#f3f6fb] text-[#65738a]"
												}`}
											>
												<Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
											</div>
											<h3 className="truncate text-[17px] font-extrabold text-[#293244]">{title}</h3>
											{(isPrimary || exceeded) && (
												<span className="hidden rounded-full bg-[#fff4c8] px-3 py-1 text-[13px] font-bold text-[#9d5b0a] sm:inline-flex">
													Limit reached
												</span>
											)}
										</div>

										<div
											className={`shrink-0 text-[18px] font-extrabold flex items-center-safe ${
												isPrimary || exceeded ? "text-[#9f4e12]" : "text-[#5d6a7c]"
											}`}
										>
											{formatValue(current)} / {formatValue(max)}
										</div>
									</div>

									<div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#dde4ec]">
										<div
											className={`h-full rounded-full ${isPrimary || exceeded ? "bg-[#f6a116]" : "bg-[#7b82ee]"}`}
											style={{width: `${percent}%`}}
										/>
									</div>
								</div>
							);
						})}
					</div>

					<p className="mt-6 flex items-start gap-3 text-[15px] font-medium leading-7 text-[#8a96a5]">
						<Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 fill-[#91a0b2] text-[#91a0b2]" strokeWidth={0} />
						<span>
							Upgrade your plan to increase your monthly limits and continue using Billifty without
							interruption.
						</span>
					</p>

					<div className="my-7 h-px bg-[#eef1f5]" />

					<section className="rounded-[14px] border border-[#dfe4f7] bg-[#f1f4ff] px-5 py-5">
						<h2 className="flex items-center gap-3 text-[18px] font-extrabold text-[#3436aa]">
							<Info aria-hidden="true" className="h-4 w-4" />
							With Billifty Pro
						</h2>

						<div className="mt-4 grid gap-x-8 gap-y-3 text-[15px] font-medium text-[#293244] sm:grid-cols-3">
							{[
								"Unlimited invoices",
								"Unlimited clients",
								"5 business profiles",
								"Custom branding",
								"Priority support",
								"Analytics dashboard",
							].map((feature) => (
								<div key={feature} className="flex items-center gap-3">
									<Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#5b5fd6]" strokeWidth={2.7} />
									<span>{feature}</span>
								</div>
							))}
						</div>
					</section>

					<div className="mt-7 grid gap-4 sm:grid-cols-2">
						<Link
							href={uri.manage_subscriptions}
							className="inline-flex h-14 items-center justify-center gap-3 rounded-[11px] bg-[#5148ee] px-6 text-[18px] font-extrabold text-white shadow-[0_8px_14px_rgba(66,55,216,0.24)] transition-opacity hover:opacity-95"
						>
							<Sparkles aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
                            {upgradeLabel()}
						</Link>
						<Link
							href={uri.pricing}
							className="inline-flex h-14 items-center justify-center gap-3 rounded-[11px] border border-[#e0e4eb] bg-white px-6 text-[18px] font-extrabold text-[#293244] transition-colors hover:bg-[#fafbff]"
						>
							<Tag aria-hidden="true" className="h-5 w-5 fill-[#91a0b2] text-[#91a0b2]" strokeWidth={0} />
							View Pricing
						</Link>
					</div>

					<div className="mt-6 flex justify-center">
						<Link
							href={uri.invoices}
							className="inline-flex items-center gap-2 text-[15px] font-medium text-[#98a5b5] transition-colors hover:text-[#5148ee]"
						>
							<ArrowLeft aria-hidden="true" className="h-4 w-4" />
							Back to My Invoices
						</Link>
					</div>
				</div>
			</section>

			<p className="mx-auto mt-7 max-w-[760px] text-center text-[15px] font-medium text-[#98a5b5]">
				Need help?{" "}
				<Link href={uri.contact_message} className="font-bold text-[#5148ee]">
					Contact support
				</Link>{" "}
				- we&apos;re happy to assist.
			</p>
		</main>
	);
}
