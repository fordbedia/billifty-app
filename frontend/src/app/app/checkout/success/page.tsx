"use client";

import BSpinner from "@/app/components/Spinner";
import Billing from "@/app/models/Billing";
import { uri } from "@/app/constants/routePaths";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleDollarSign,
  Crown,
  Info,
  ReceiptText,
  Users,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {useUser} from "@/app/providers/UserContext";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

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

const DEFAULT_PLAN_NAME = "-";
const DEFAULT_PRICE = "-";

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

function Inner() {
  const {me, reSendVerification, reSendVerificationSuccess, reSendVerificationisPending} = useUser()
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<SuccessCheckout>(null);
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

        setSession(user);

        if (user) {
          queryClient.setQueryData(["profile"], user);
        }

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
  }, [queryClient, sessionId]);
  const effectiveUser = session ?? me ?? null;
  const subscription = effectiveUser?.subscription ?? null;

  const summary = useMemo(() => {
    const planCode = effectiveUser?.subscription?.plan_code
    const billingCycle = effectiveUser?.subscription?.billing_cycle
    const amount = effectiveUser?.subscription?.unit_amount;
    return {
      planLabel: formatPlanName(planCode),
      cycleLabel: formatCycleName(billingCycle),
      amountLabel: formatAmount(amount),
      amountSuffix: formatAmountSuffix(billingCycle),
    };
  }, [effectiveUser?.subscription]);

  const isPlanFree = effectiveUser?.subscription?.plan_code === 'free';

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
            {isPlanFree ? '' : 'Your subscription is now active'}
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
                      {isPlanFree ? '-' : summary.cycleLabel}
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
                      <span>{isPlanFree ? '-' : summary.amountLabel}</span>
                      <span className="pb-[2px] text-sm font-semibold text-slate-400">
                        {isPlanFree ? '-' : summary.amountSuffix}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*<div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] bg-[#FBFDFF] px-4 py-3 ring-1 ring-slate-100">*/}
            {/*  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">*/}
            {/*    <Info className="h-4 w-4 text-[#5C4DF6]" strokeWidth={2.5} />*/}
            {/*    <span>Next billing date:</span>*/}
            {/*  </div>*/}
            {/*  <p className="text-sm font-bold text-slate-700">{isPlanFree ? '-' : summary.nextBillingDate}</p>*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="mt-5 w-full rounded-[24px] bg-white p-4 shadow-[0_30px_80px_-44px_rgba(17,24,39,0.28)] ring-1 ring-black/5 md:p-5">
          <div className="px-2 pt-2 text-center">
            <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-slate-900 sm:text-[40px] md:text-[42px]">
              Continue With Onboarding
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Your subscription is active. Finish onboarding to set up your workspace and start invoicing without gaps.
            </p>
            {!me?.email_verified_at && (
                <div className="mx-auto mt-4 w-full max-w-[620px] rounded-[18px] border border-[#dceaf6] bg-[#f5faff] px-5 py-4 text-left shadow-[0_14px_34px_-28px_rgba(29,132,198,0.45)]">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4f1fb] text-[#1d84c6]">
                      <Info className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-6 text-[#28516d]">
                        Verify your email address to start managing your subscription.
                      </p>
                      <p className="mt-1 text-sm font-medium leading-6 text-[#5d7890]">
                        Need another verification link?
                        <span onClick={() => reSendVerification()} className="ml-1 cursor-pointer font-semibold text-[#1d84c6] transition-colors duration-200 hover:text-[#166fa8]">
                          {reSendVerificationisPending ? 'Verifying...' : (reSendVerificationSuccess ? 'Verification Sent.' : 'Click here to resend the verification email.')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
            )}

          </div>

          <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#ddd6fe] bg-[linear-gradient(135deg,#f8f5ff_0%,#ffffff_45%,#eef7ff_100%)] p-5 shadow-[0_34px_80px_-48px_rgba(76,29,149,0.35)] md:p-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-[#8b5cf6]/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#38bdf8]/15 blur-3xl" />
            </div>

            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6d28d9] shadow-[0_14px_28px_-22px_rgba(109,40,217,0.55)] backdrop-blur">
                  Next Step
                </span>
                <h3 className="mt-4 text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[34px]">
                  Go to onboarding and complete your setup flow
                </h3>
                <p className="mt-3 max-w-[620px] text-sm font-medium leading-7 text-slate-600 sm:text-[15px]">
                  We recommend continuing straight into onboarding now. It will guide you through the required setup so your business profile, clients, and first invoice are all configured in the right order.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href={uri.onboarding}>
                    <Button
                      className="h-12 rounded-xl bg-[linear-gradient(135deg,#5C4DF6_0%,#8B3AF4_55%,#F0278E_100%)] px-6 text-sm font-bold text-white shadow-[0_20px_42px_-24px_rgba(92,77,246,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_54px_-24px_rgba(92,77,246,0.95)]"
                      endContent={<ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
                    >
                      Start Onboarding
                    </Button>
                  </Link>
                  <Button
                    variant="bordered"
                    className="h-12 rounded-xl border-[#d7def0] bg-white/80 px-6 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#bfd4ec] hover:bg-[#f8fbff]"
                    onPress={() => router.push(uri.invoices)}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>

              <div className="relative rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ede9fe] text-[#6d28d9] shadow-[0_12px_28px_-18px_rgba(109,40,217,0.7)]">
                  <ArrowRight className="h-5 w-5 animate-pulse" strokeWidth={2.6} />
                </div>

                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Onboarding Includes
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-[16px] border border-[#ede9fe] bg-[#faf7ff] p-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5C4DF6] text-white shadow-[0_16px_32px_-20px_rgba(92,77,246,0.95)]">
                      <BriefcaseBusiness className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Business profile setup</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Add company details and payment information.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[16px] border border-[#f3e8ff] bg-[#fcf8ff] p-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#A52CF6] text-white shadow-[0_16px_32px_-20px_rgba(165,44,246,0.95)]">
                      <Users className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Client onboarding</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Create your client list before sending invoices.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[16px] border border-[#dcfce7] bg-[#f2fff8] p-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0EA96B] text-white shadow-[0_16px_32px_-20px_rgba(14,169,107,0.95)]">
                      <ReceiptText className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">First invoice walkthrough</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Finish setup and move directly into invoicing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*<div className="mt-4 rounded-[20px] bg-gradient-to-r from-[#5B43F4] via-[#8B3AF4] to-[#F0278E] px-5 py-6 text-center text-white shadow-[0_28px_60px_-32px_rgba(91,67,244,0.8)]">*/}
          {/*  <h3 className="text-[22px] font-extrabold tracking-[-0.03em]">*/}
          {/*    Need Help Getting Started?*/}
          {/*  </h3>*/}
          {/*  <p className="mt-2 text-sm font-medium text-white/85">*/}
          {/*    Our support team is here to assist you every step of the way*/}
          {/*  </p>*/}

          {/*  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">*/}
          {/*    <Button*/}
          {/*      className="h-11 rounded-xl bg-white px-5 font-bold text-[#5C4DF6]"*/}
          {/*      startContent={<LifeBuoy className="h-4 w-4" strokeWidth={2.4} />}*/}
          {/*      onPress={() => window.location.assign("mailto:support@billifty.com")}*/}
          {/*    >*/}
          {/*      Contact Support*/}
          {/*    </Button>*/}
          {/*    <Button*/}
          {/*      className="h-11 rounded-xl border border-white/70 bg-transparent px-5 font-bold text-white"*/}
          {/*      startContent={<BookOpen className="h-4 w-4" strokeWidth={2.4} />}*/}
          {/*      variant="bordered"*/}
          {/*      onPress={() => router.push(uri.intro)}*/}
          {/*    >*/}
          {/*      View Documentation*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/*{error ? (*/}
        {/*  <div className="mt-4 flex w-full items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">*/}
        {/*    <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />*/}
        {/*    <p>*/}
        {/*      We showed the latest cached subscription details because the confirmation request returned an*/}
        {/*      error: {error}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*) : null}*/}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
      <Suspense
        fallback={
          <div className="flex w-full justify-center py-16">
            <BSpinner />
          </div>
        }
      >
        <Inner />
      </Suspense>
  );
}
