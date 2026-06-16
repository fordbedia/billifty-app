"use client";

import {useEffect, useState} from "react";
import {Check, CircleDollarSign, FileText} from "lucide-react";
import BSpinner from "@/app/components/Spinner";
import {uri} from "@/app/constants/routePaths";
import {useApp} from "@/app/providers/AppContext";
import {useRouter} from "next/navigation";
import {useUser} from "@/app/providers/UserContext";

type ChecklistStatus = "completed" | "current" | "pending";

type ChecklistItem = {
    id: number;
    name: string;
    title: string;
    description: string;
    status: ChecklistStatus;
    uri: string;
};

const DEFAULT_ITEMS: ChecklistItem[] = [
    {
        id: 1,
        name: "business_profiles",
        title: "Business Profile",
        description: "Set up your company details, payment methods, and business information for professional invoicing.",
        status: "current",
        uri: uri.business_profile.create,
    },
    {
        id: 2,
        name: "clients",
        title: "Clients",
        description: "Organize and manage your client database for streamlined contact management and communication.",
        status: "pending",
        uri: uri.client.create_client,
    },
    {
        id: 3,
        name: "invoices",
        title: "Invoices",
        description: "Create, customize, and send professional invoices with automated tracking and payment processing.",
        status: "pending",
        uri: uri.create_invoice,
    },
];

const CHECKLIST_KEYS = [
    "business_profiles",
    "clients",
    "invoices",
] as const;

const buildChecklistItems = (
    onboardingData: Record<string, number> | undefined
): ChecklistItem[] => {
    const completedCount = CHECKLIST_KEYS.filter(
        (key) => Number(onboardingData?.[key] ?? 0) > 0
    ).length;
    return DEFAULT_ITEMS.map((item, index) => {
        const value = Number(onboardingData?.[item.name] ?? 0);

        if (value > 0) {
            return {
                ...item,
                status: "completed",
            };
        }

        if (index === completedCount) {
            return {
                ...item,
                status: "current",
            };
        }

        return {
            ...item,
            status: "pending",
        };
    });
};

export default function OnboardingPage() {
    const router = useRouter();
    const {userData, isUserDataLoading} = useApp();
    const {me} = useUser()
    const onboardingCompleted: boolean  = Boolean(me?.onboarding?.is_completed)
    const onboardingData = userData?.over_all_usages;
    const calculatedCompletedSteps = CHECKLIST_KEYS.filter(
        (key) => Number(onboardingData?.[key] ?? 0) > 0
    ).length;
    const calculatedTotalSteps = CHECKLIST_KEYS.length;
    const progressValue = Math.max(
        0,
        Math.min(100, Math.round((calculatedCompletedSteps / calculatedTotalSteps) * 100))
    );
    const onboardingTrueProgress = onboardingCompleted ? 100 : 0;
    const trueProgressValue = onboardingTrueProgress >= 100 ? 100 : progressValue
    const progressFill = trueProgressValue >= 100
        ? "linear-gradient(90deg, #10c97f 0%, #10c97f 100%)"
        : trueProgressValue >= 67
            ? "linear-gradient(90deg, #f3c623 0%, #86c93c 55%, #10c97f 100%)"
            : trueProgressValue > 0
                ? "linear-gradient(90deg, #f3c623 0%, #d6cf30 58%, #a6cb3f 100%)"
                : "linear-gradient(90deg, #f3c623 0%, #f3c623 100%)";
    const currentBusinessProfiles = onboardingData?.["business_profiles"];
    const currentClients = onboardingData?.["clients"];
    const currentInvoices = onboardingData?.["invoices"];
    const currentItem: ChecklistItem | null | undefined = buildChecklistItems(onboardingData).find((item) => item.status === "current");

    const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setItems(buildChecklistItems(onboardingData));
    }, [onboardingData, currentBusinessProfiles, currentClients, currentInvoices]);

    const onContinue = () => {
        const nextUri = currentItem?.uri;
        if (!nextUri) return;

        try {
            setIsLoading(true);
            if (currentItem?.name === 'invoices') {
                window.open(`${nextUri}?from=onboarding&clear=true`, '_blank');
                return;
            }
            router.replace(`${nextUri}?from=onboarding`);
        } catch (error) {
            console.error("Error redirecting to next URI:", error);
            setIsLoading(false);
        }
    };

    const onSkip = () => {
        router.replace(uri.invoices);
    };

    if (isUserDataLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <BSpinner/>
            </div>
        );
    }

    return (
        <section className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-[1230px]">
                <div className="mx-auto max-w-[760px] text-center">
                    <h1 className="text-[34px] font-semibold leading-[1.1] text-[#111827] sm:text-[44px]">
                        Complete Your Setup Journey
                    </h1>
                    <p className="mx-auto mt-5 max-w-[680px] text-[18px] leading-[1.5] text-[#111827] sm:text-[19px]">
                        Follow these simple steps to unlock the full potential of your invoicing platform. Each step
                        builds upon the previous one to create a seamless business workflow.
                    </p>
                </div>

                <div
                    className="mt-12 rounded-[28px] border border-[#e8edf3] bg-white px-6 py-8 shadow-[0_12px_36px_rgba(15,23,42,0.04)] sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-[28px] font-semibold leading-none text-[#111827]">
                            Your Progress
                        </h2>
                        <div
                            className="inline-flex min-h-[42px] items-center rounded-full bg-[#edf4ff] px-6 text-[16px] font-medium text-[#2793d7]">
                            {calculatedCompletedSteps} of {calculatedTotalSteps} completed
                        </div>
                    </div>

                    <div className="mt-8 h-[12px] w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${trueProgressValue}%`,
                                background: progressFill,
                            }}
                        />
                    </div>

                    <p className="mt-5 text-[16px] leading-[1.5] text-[#111827] sm:text-[18px]">
                        {calculatedCompletedSteps === calculatedTotalSteps
                            ? "Your setup is complete. You're ready to start creating professional invoices."
                            : "You're almost there! Complete the final step to start creating professional invoices."}
                    </p>
                </div>

                <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,544px)] lg:items-start">
                    <div className="min-w-0">
                        {items.map((item, index) => {
                            const isCompleted = item.status === "completed";
                            const isCurrent = item.status === "current";
                            const showConnector = index !== items.length - 1;
                            const connectorClassName = isCompleted
                                ? "bg-[#10c97f]"
                                : index < calculatedCompletedSteps
                                    ? "bg-[#10c97f]"
                                    : "bg-[#e5e7eb]";

                            return (
                                <div
                                    key={item.id}
                                    className="relative pb-7 pl-[86px] sm:pl-[104px]"
                                >
                                    <div className="absolute left-0 top-0 flex flex-col items-start">
                                        <div
                                            className={[
                                                "flex h-[56px] w-[56px] items-center rounded-full text-[20px] font-semibold sm:h-[66px] sm:w-[66px] sm:text-[22px]",
                                                isCompleted || onboardingCompleted ? "bg-[#10c97f] text-white" : "",
                                                isCurrent ? "bg-[#10c97f] text-white" : "",
                                                !isCompleted && !isCurrent ? "bg-[#e5e7eb] text-[#6b7280]" : "",
                                                isCompleted ? "justify-center" : "justify-start pl-[22px] sm:pl-[26px]",
                                            ].join(" ")}
                                        >
                                            {isCompleted ? <Check className="h-8 w-8 stroke-[3]"/> : item.id}
                                        </div>

                                        {showConnector ? (
                                            <div
                                                className={`ml-[26px] mt-1 h-[100px] w-[4px] rounded-full sm:ml-[31px] ${connectorClassName}`}/>
                                        ) : (
                                            <div
                                                className="ml-[26px] mt-1 h-[100px] w-[4px] rounded-full bg-[#e5e7eb] sm:ml-[31px]"/>
                                        )}
                                    </div>

                                    <div className="pt-1">
                                        <h3 className="text-[28px] font-semibold leading-[1.15] text-[#111827] sm:text-[31px]">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 max-w-[620px] text-[18px] leading-[1.55] text-[#111827] sm:text-[19px]">
                                            {item.description}
                                        </p>

                                        <div className="mt-5 flex items-center gap-3">
                                            <span
                                                className={[
                                                    "inline-flex h-6 w-6 items-center justify-center rounded-full",
                                                    isCompleted ? "bg-[#10c97f]" : "",
                                                    isCurrent ? "bg-[#10c97f]" : "",
                                                    !isCompleted && !isCurrent ? "bg-[#e5e7eb]" : "",
                                                ].join(" ")}
                                            >
                                                {isCompleted || onboardingCompleted ? (
                                                    <Check className="h-4 w-4 stroke-[3] text-white"/>
                                                ) : (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-white/90"/>
                                                )}
                                            </span>
                                            <span
                                                className={[
                                                    "text-[16px] font-medium sm:text-[17px]",
                                                    isCompleted || onboardingCompleted ? "text-[#10c97f]" : "",
                                                    isCurrent ? "text-[#10c97f]" : "",
                                                    !isCompleted && !isCurrent ? "text-[#6b7280]" : "",
                                                ].join(" ")}
                                            >
                                                {isCompleted || onboardingCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:pt-[2px]">
                        <div
                            className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#f7bd18_0%,#66c08c_55%,#1aa7ff_100%)] p-[1px] shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                            <div
                                className="rounded-[27px] bg-[linear-gradient(135deg,rgba(247,189,24,0.88)_0%,rgba(102,192,140,0.82)_52%,rgba(26,167,255,0.95)_100%)] px-7 py-8 text-white sm:px-8 sm:py-9">
                                <div className="flex items-start gap-5">
                                    <div
                                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/16">
                                        <FileText className="h-7 w-7 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-semibold leading-[1.15] sm:text-[26px]">
                                            {typeof currentItem === 'undefined' ? 'Congrats, You’re Ready to Invoice!' : 'Ready to Create Invoices?'}
                                        </h3>
                                        <p className="mt-3 text-[18px] leading-[1.5] text-white/95">
                                            {currentItem?.status === "current" || onboardingCompleted
                                                ? "Complete your setup and start billing your clients today."
                                                : "Your setup is complete and your invoicing workspace is ready."}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onContinue}
                                    disabled={!currentItem || isLoading}
                                    className="group cursor-pointer relative mt-8 flex min-h-[58px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-white px-6 text-[21px] font-semibold text-[#1c9cea] shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_18px_38px_rgba(28,156,234,0.25)] transition duration-300 hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_24px_52px_rgba(28,156,234,0.32)] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 animate-[ctaGlow_2.2s_ease-in-out_infinite]"
                                >
                                    <span
                                        className="absolute inset-0 rounded-[16px] bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.35),transparent_62%)] opacity-90 blur-[2px] animate-[ctaGlowInner_2.2s_ease-in-out_infinite]"/>
                                    <span
                                        className="absolute inset-y-0 left-[-35%] w-[34%] skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.92),transparent)] opacity-80 animate-[ctaShimmer_2.8s_ease-in-out_infinite]"/>
                                    <span className="absolute inset-0 rounded-[16px] ring-1 ring-[#7ed6ff]/50"/>
                                    <span className="relative z-[1]">
                                        {typeof currentItem === 'undefined' ? 'Setup Completed' : (isLoading ? "Redirecting..." : (`Complete ${(currentItem?.title || '')} Setup`))}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {typeof currentItem !== 'undefined' && (<button
                            type="button"
                            onClick={onSkip}
                            className="mt-5 cursor-pointer inline-flex items-center gap-2 text-[15px] font-medium text-[#6b7280] transition hover:text-[#111827]"
                        >
                            Skip for now
                        </button>)}
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes ctaGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4),
                        0 18px 38px rgba(28, 156, 234, 0.25),
                        0 0 0 rgba(125, 211, 252, 0);
                    }
                    50% {
                        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6),
                        0 24px 54px rgba(28, 156, 234, 0.34),
                        0 0 28px rgba(125, 211, 252, 0.55);
                    }
                }

                @keyframes ctaGlowInner {
                    0%, 100% {
                        opacity: 0.55;
                        transform: scale(0.98);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.03);
                    }
                }

                @keyframes ctaShimmer {
                    0% {
                        transform: translateX(0) skewX(-18deg);
                        opacity: 0;
                    }
                    18% {
                        opacity: 0.75;
                    }
                    55% {
                        opacity: 0.55;
                    }
                    100% {
                        transform: translateX(430%) skewX(-18deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </section>
    );
}
