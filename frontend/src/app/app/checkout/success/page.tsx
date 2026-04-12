"use client";

import RootLayout from "@/app/components/common/RootLayout";
import BSpinner from "@/app/components/Spinner";
import Billing from "@/app/models/Billing";
import { uri } from "@/app/constants/routePaths";
import { formattedDate } from "@/app/utils/date";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleDollarSign,
  Crown,
  Info,
  LifeBuoy,
  type LucideIcon,
  ReceiptText,
  Settings2,
  Users,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SuccessCheckout = {
  subscription?: {
    plan_code?: string;
    billing_cycle?: string;
    unit_amount?: number;
    status?: string;
    renews_at?: string | null;
  } | null;
  plan?: {
    code?: string;
    name?: string;
  } | null;
} | null;

type CheckoutConfirmation = {
  plan_code?: string;
  billing_cycle?: string;
  renews_at?: string | null;
  starts_at?: string | null;
  user?: SuccessCheckout;
} | null;

type SetupCard = {
  title: string;
  description: string;
  action: string;
  stepLabel: string;
  icon: LucideIcon;
  iconWrapClass: string;
  accentClass: string;
  buttonClass: string;
  href: string;
};

const DEFAULT_PLAN_NAME = "Professional Plan";
const DEFAULT_PRICE = "$49.99";
const DEFAULT_BILLING_DATE = "January 28, 2026";

const SETUP_CARDS: SetupCard[] = [
  {
    title: "Set Up Your Profile",
    description:
      "Complete your profile with your business information, contact details, and preferences to personalize your experience.",
    action: "Start Now",
    stepLabel: "Step 1",
    icon: Settings2,
    iconWrapClass: "bg-[#5C4DF6] text-white",
    accentClass: "from-[#E9EEFF] to-[#F5F7FF]",
    buttonClass: "bg-[#5C4DF6] text-white shadow-[0_16px_32px_-18px_rgba(92,77,246,0.9)]",
    href: uri.profile,
  },
  {
    title: "Add Clients",
    description:
      "Import or manually add your client list to start managing relationships and tracking interactions efficiently.",
    action: "Add Clients",
    stepLabel: "Step 2",
    icon: Users,
    iconWrapClass: "bg-[#A52CF6] text-white",
    accentClass: "from-[#F7ECFF] to-[#FFF5FD]",
    buttonClass: "bg-[#A52CF6] text-white shadow-[0_16px_32px_-18px_rgba(165,44,246,0.9)]",
    href: uri.client.clients,
  },
  {
    title: "Add Business Profile",
    description:
      "Set up your business profile with logo, company details, and payment information for professional invoicing.",
    action: "Set Up",
    stepLabel: "Step 3",
    icon: BriefcaseBusiness,
    iconWrapClass: "bg-[#F6339A] text-white",
    accentClass: "from-[#FFEAF5] to-[#FFF4F9]",
    buttonClass: "bg-[#F6339A] text-white shadow-[0_16px_32px_-18px_rgba(246,51,154,0.85)]",
    href: uri.business_profile.create,
  },
  {
    title: "Create Your First Invoice",
    description:
      "Generate your first professional invoice in minutes and send it to your clients with automated reminders.",
    action: "Create Invoice",
    stepLabel: "Step 4",
    icon: ReceiptText,
    iconWrapClass: "bg-[#0EA96B] text-white",
    accentClass: "from-[#E8FFF4] to-[#F2FFFA]",
    buttonClass: "bg-[#0EA96B] text-white shadow-[0_16px_32px_-18px_rgba(14,169,107,0.85)]",
    href: uri.create_invoice,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeWord(value?: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatPlanName(planCode?: string, fallbackName?: string) {
  const normalized = (planCode ?? "").trim().toLowerCase();

  if (fallbackName?.trim()) return fallbackName;
  if (normalized === "pro") return "Professional Plan";
  if (normalized === "premium") return "Premium Plan";
  if (normalized === "free") return "Free Plan";

  const label = normalizeWord(normalized);
  return label ? `${label} Plan` : DEFAULT_PLAN_NAME;
}

function formatCycleName(billingCycle?: string) {
  const normalized = (billingCycle ?? "").trim().toLowerCase();
  if (normalized === "yearly") return "Yearly";
  if (normalized === "monthly") return "Monthly";
  return "Monthly";
}

function formatAmount(unitAmount?: number) {
  if (typeof unitAmount === "number" && unitAmount > 0) {
    return `$${(unitAmount / 100).toFixed(2)}`;
  }

  return DEFAULT_PRICE;
}

function formatAmountSuffix(billingCycle?: string) {
  return (billingCycle ?? "").trim().toLowerCase() === "yearly" ? "/year" : "/month";
}

function formatBillingDate(value?: string | null) {
  if (!value) return DEFAULT_BILLING_DATE;

  try {
    return formattedDate(value);
  } catch {
    return DEFAULT_BILLING_DATE;
  }
}

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<SuccessCheckout>(null);
  const [confirmation, setConfirmation] = useState<CheckoutConfirmation>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session_id from Stripe redirect.");
      setIsLoading(false);
      return;
    }

    const run = async () => {
      try {
        setError(null);

        const res = await Billing.confirmCheckout({ session_id: sessionId });
        const user = res?.user ?? null;

        setConfirmation(res);
        setSession(user);

        if (user) {
          window.sessionStorage.setItem("success_checkout", JSON.stringify(user));
        }
      } catch (err: any) {
        try {
          const cached = window.sessionStorage.getItem("success_checkout");
          const parsed = cached ? (JSON.parse(cached) as SuccessCheckout) : null;

          if (parsed?.subscription) {
            setSession(parsed);
          }
        } catch {
          // Ignore cache parse errors and surface the request error below.
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to confirm subscription.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [sessionId]);

  const subscription = session?.subscription ?? null;

  const summary = useMemo(() => {
    const planCode = subscription?.plan_code ?? confirmation?.plan_code ?? session?.plan?.code ?? "";
    const billingCycle = subscription?.billing_cycle ?? confirmation?.billing_cycle ?? "";
    const amount = subscription?.unit_amount;
    const renewsAt = subscription?.renews_at ?? confirmation?.renews_at ?? null;

    return {
      planLabel: formatPlanName(planCode, session?.plan?.name),
      cycleLabel: formatCycleName(billingCycle),
      amountLabel: formatAmount(amount),
      amountSuffix: formatAmountSuffix(billingCycle),
      nextBillingDate: formatBillingDate(renewsAt),
    };
  }, [confirmation, session?.plan?.code, session?.plan?.name, subscription]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-6 py-4 shadow-[0_24px_70px_-36px_rgba(91,77,246,0.55)] backdrop-blur">
          <BSpinner />
          <span className="text-sm font-medium text-slate-600">Confirming your subscription...</span>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-8 text-center shadow-[0_35px_80px_-42px_rgba(15,23,42,0.35)]">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            We couldn&apos;t load your checkout result
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="bg-[#5C4DF6] font-semibold text-white"
              onPress={() => router.push(uri.manage_subscriptions)}
            >
              Manage Subscription
            </Button>
            <Button variant="bordered" onPress={() => router.push(uri.invoices)}>
              Go to Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#fbf7ff_35%,#f8f3fb_100%)] px-4 py-8 md:px-6 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-64 w-80 -translate-x-1/2 rounded-full bg-[#EC4899]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[760px] flex-col items-center">
        <div className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2ECC71] shadow-[0_18px_40px_-20px_rgba(46,204,113,0.75)]">
          <Check className="h-9 w-9 text-white" strokeWidth={3} />
        </div>

        <h1 className="mt-5 text-center text-[32px] font-extrabold leading-none tracking-[-0.03em] text-[#6A35F2] sm:text-[44px]">
          Congratulations!
        </h1>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          Your subscription is now active
        </p>

        <div className="mt-8 w-full rounded-[24px] border border-[#7C4DFF] bg-white px-4 py-4 shadow-[0_30px_80px_-44px_rgba(17,24,39,0.35)] md:px-5 md:py-5">
          <div className="rounded-[22px] bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Subscription Plan
                </p>
                <h2 className="mt-2 text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#5C3BF6]">
                  {summary.planLabel}
                </h2>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A52CF6] text-white shadow-[0_18px_34px_-18px_rgba(165,44,246,0.95)]">
                <Crown className="h-5 w-5" fill="currentColor" strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[18px] bg-[#F5F4FF] p-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5C4DF6] text-white shadow-[0_16px_32px_-20px_rgba(92,77,246,0.95)]">
                    <CalendarDays className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      Billing Cycle
                    </p>
                    <p className="text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
                      {summary.cycleLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] bg-[#FFF4FB] p-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A52CF6] text-white shadow-[0_16px_32px_-20px_rgba(165,44,246,0.95)]">
                    <CircleDollarSign className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      Amount
                    </p>
                    <p className="flex items-end gap-1 text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
                      <span>{summary.amountLabel}</span>
                      <span className="pb-[2px] text-sm font-semibold text-slate-400">
                        {summary.amountSuffix}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] bg-[#FBFDFF] px-4 py-3 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Info className="h-4 w-4 text-[#5C4DF6]" strokeWidth={2.5} />
                <span>Next billing date:</span>
              </div>
              <p className="text-sm font-bold text-slate-700">{summary.nextBillingDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full rounded-[24px] bg-white p-4 shadow-[0_30px_80px_-44px_rgba(17,24,39,0.28)] ring-1 ring-black/5 md:p-5">
          <div className="px-2 pt-2 text-center">
            <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-slate-900 sm:text-[40px] md:text-[42px]">
              Get Started in 4 Easy Steps
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Complete these steps to unlock the full potential of your account
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {SETUP_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={cn(
                    "rounded-[18px] border border-black/5 bg-gradient-to-br p-4 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.45)]",
                    card.accentClass,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm", card.iconWrapClass)}>
                      <Icon className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-bold text-[#7C3AED] ring-1 ring-white/80">
                      {card.stepLabel}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 min-h-24 text-sm font-medium leading-6 text-slate-600">
                    {card.description}
                  </p>

                  <Button
                    className={cn(
                      "mt-4 h-11 rounded-xl px-5 text-sm font-bold",
                      card.buttonClass,
                    )}
                    endContent={<ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
                    onPress={() => router.push(card.href)}
                  >
                    {card.action}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-[20px] bg-gradient-to-r from-[#5B43F4] via-[#8B3AF4] to-[#F0278E] px-5 py-6 text-center text-white shadow-[0_28px_60px_-32px_rgba(91,67,244,0.8)]">
            <h3 className="text-[22px] font-extrabold tracking-[-0.03em]">
              Need Help Getting Started?
            </h3>
            <p className="mt-2 text-sm font-medium text-white/85">
              Our support team is here to assist you every step of the way
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                className="h-11 rounded-xl bg-white px-5 font-bold text-[#5C4DF6]"
                startContent={<LifeBuoy className="h-4 w-4" strokeWidth={2.4} />}
                onPress={() => window.location.assign("mailto:support@billifty.com")}
              >
                Contact Support
              </Button>
              <Button
                className="h-11 rounded-xl border border-white/70 bg-transparent px-5 font-bold text-white"
                startContent={<BookOpen className="h-4 w-4" strokeWidth={2.4} />}
                variant="bordered"
                onPress={() => router.push(uri.intro)}
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex w-full items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            <p>
              We showed the latest cached subscription details because the confirmation request returned an
              error: {error}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <RootLayout>
      <Suspense
        fallback={
          <div className="flex w-full justify-center py-16">
            <BSpinner />
          </div>
        }
      >
        <Inner />
      </Suspense>
    </RootLayout>
  );
}
