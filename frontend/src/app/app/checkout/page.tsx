"use client";

import RootLayout from "@/app/components/common/RootLayout";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import BSpinner from "@/app/components/Spinner";
import Billing from "@/app/models/Billing";
import { uri } from "@/app/constants/routePaths";

function CheckoutRedirectInner() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const planParam = searchParams.get("plan");
  const cycleParam = searchParams.get("cycle");

  const planCode = (planParam === "pro" || planParam === "premium") ? planParam : "pro";
  const billingCycle = (cycleParam === "yearly" || cycleParam === "monthly") ? cycleParam : "monthly";

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);

        const successUrl = window.location.origin + uri.checkout_success; // or a dedicated success page
        const cancelUrl  = window.location.origin + uri.manage_subscriptions;

        const res = await Billing.createCheckoutSession({
          plan_code: planCode,
          billing_cycle: billingCycle,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });

        const url = res?.url ?? res?.data?.url;
        if (!url) {
          setError("Stripe Checkout did not return a URL.");
          return;
        }

        window.location.href = url;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Unable to start checkout.";
        setError(msg);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planCode, billingCycle]);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      {error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <div className="flex items-center gap-2">
          <BSpinner />
          <span className="text-sm text-slate-600">Redirecting to Stripe Checkout…</span>
        </div>
      )}
    </div>
  );
}

export default function BillingCheckoutPage() {
  return (
    <RootLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-3">Secure Checkout</h1>
          <p className="text-sm text-slate-600 mb-6">
            You’ll complete your subscription securely on Stripe.
          </p>

          <Suspense fallback={<div className="w-full flex justify-center py-16"><BSpinner /></div>}>
            <CheckoutRedirectInner />
          </Suspense>
        </div>
      </div>
    </RootLayout>
  );
}
