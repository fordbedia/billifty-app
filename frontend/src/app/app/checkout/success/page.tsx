"use client";

import RootLayout from "@/app/components/common/RootLayout";
import BSpinner from "@/app/components/Spinner";
import Image from "next/image";
import { Button, Card, CardBody } from "@heroui/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uri } from "@/app/constants/routePaths";
import Billing from "@/app/models/Billing";

type SuccessCheckout = {
  subscription?: {
    plan_code?: string;
    billing_cycle?: string;
    unit_amount?: number;
    status?: string;
  } | null;
  plan?: {
    code?: string;
  } | null;
};

type CheckoutConfirmation = {
  plan_code?: string;
  billing_cycle?: string;
  user?: SuccessCheckout | null;
};

function formatLabel(value?: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<SuccessCheckout | null>(null);
  const [confirmation, setConfirmation] = useState<CheckoutConfirmation | null>(null);
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
          // Ignore cache parse errors and show request error below.
        }

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to confirm subscription."
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
    const cents = subscription?.unit_amount ?? 0;

    return {
      planLabel: formatLabel(planCode),
      cycleLabel: formatLabel(billingCycle),
      priceLabel: cents > 0 ? `$${(cents / 100).toFixed(2)}` : "Active",
    };
  }, [confirmation, session?.plan?.code, subscription]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
          <BSpinner />
          <span className="text-sm text-slate-600">Confirming your subscription…</span>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-xl border border-rose-200 bg-white shadow-sm">
          <CardBody className="gap-4 p-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">We couldn&apos;t load your checkout result</h1>
            <p className="text-sm text-slate-600">{error}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button className="bg-indigo-600 text-white" onPress={() => router.push(uri.manage_subscriptions)}>
                Manage Subscription
              </Button>
              <Button variant="bordered" onPress={() => router.push(uri.invoices)}>
                Go to Invoices
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-10">
      <div className="w-full rounded-[2rem] bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-6 py-10 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 md:px-12">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/images/check-icon-success.png"
            alt="Check Success Icon"
            width={216}
            height={216}
            className="mx-auto"
          />

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Subscription confirmed
          </h1>

          <p className="pt-4 text-lg font-light text-slate-700">
            Your account is now on the <strong className="font-semibold text-emerald-700">{summary.planLabel || "paid"}</strong> plan.
            You can start using the upgraded billing features immediately.
          </p>

          {error ? (
            <p className="pt-3 text-sm text-amber-700">
              We showed the latest cached subscription details because the confirmation request returned an error: {error}
            </p>
          ) : null}

          <Card className="mt-8 border border-slate-200 bg-white/90">
            <CardBody>
              <div className="grid gap-8 py-5 md:grid-cols-3">
                <div className="text-center">
                  <Image src="/images/checkout/premium-plan-icon.png" alt="Plan Icon" width={64} height={64} className="mx-auto" />
                  <h2 className="pt-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Plan</h2>
                  <p className="pt-1 text-lg text-slate-900">{summary.planLabel || "Active plan"}</p>
                </div>

                <div className="text-center">
                  <Image src="/images/checkout/billing-monthly-icon.png" alt="Billing Icon" width={64} height={64} className="mx-auto" />
                  <h2 className="pt-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing Cycle</h2>
                  <p className="pt-1 text-lg text-slate-900">{summary.cycleLabel || "On file"}</p>
                </div>

                <div className="text-center">
                  <Image src="/images/checkout/dollar-icon.png" alt="Dollar Icon" width={64} height={64} className="mx-auto" />
                  <h2 className="pt-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Amount</h2>
                  <p className="pt-1 text-lg text-slate-900">
                    {summary.priceLabel}
                    {summary.cycleLabel ? ` / ${summary.cycleLabel.toLowerCase()}` : ""}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="bg-indigo-600 px-8 text-white" onPress={() => router.push(uri.invoices)}>
              View Invoice Dashboard
            </Button>
            <Button variant="bordered" onPress={() => router.push(uri.manage_subscriptions)}>
              Manage Subscription
            </Button>
          </div>

          <Card className="mt-8 border border-emerald-100 bg-emerald-50/80 text-left">
            <CardBody className="p-8">
              <h2 className="text-center text-2xl font-semibold text-slate-900">What&apos;s next</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">1</div>
                  <h3 className="text-lg font-semibold text-slate-900">Set up your profile</h3>
                  <p className="mt-2 text-sm text-slate-600">Finish your business details so invoices and payment flows are ready to send.</p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">2</div>
                  <h3 className="text-lg font-semibold text-slate-900">Add clients</h3>
                  <p className="mt-2 text-sm text-slate-600">Bring in your customers now so your first invoice only takes a few clicks.</p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">3</div>
                  <h3 className="text-lg font-semibold text-slate-900">Create your first invoice</h3>
                  <p className="mt-2 text-sm text-slate-600">Use the upgraded plan immediately and send a polished invoice from the dashboard.</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <RootLayout>
      <Suspense fallback={<div className="w-full flex justify-center py-16"><BSpinner /></div>}>
        <Inner />
      </Suspense>
    </RootLayout>
  );
}
