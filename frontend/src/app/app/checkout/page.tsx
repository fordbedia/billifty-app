"use client";

import RootLayout from "@/app/components/common/RootLayout";
import { StripeProvider } from "@/app/providers/StripeProvider";
import CheckoutForm from "./CheckoutForm";
import { useSearchParams } from "next/navigation";

export default function BillingCheckoutPage() {
  const searchParams = useSearchParams();

  // Read "?plan=premium" or "?plan=pro" from URL
  const planParam = searchParams.get("plan");

  // Force allowed plan codes only
  const allowedPlans = ["pro", "premium"] as const;

  const planCode = allowedPlans.includes(planParam as any)
    ? (planParam as "pro" | "premium")
    : "pro"; // default plan

  // Read ?cycle=yearly (optional)
  const cycleParam = searchParams.get("cycle");
  const allowedCycles = ["monthly", "yearly"] as const;

  const initialBillingCycle = allowedCycles.includes(cycleParam as any)
    ? (cycleParam as "monthly" | "yearly")
    : "monthly";

  return (
    <RootLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
            Complete your subscription
          </h1>

          <StripeProvider
            planCode={planCode}
            initialBillingCycle={initialBillingCycle}
          >
            <CheckoutForm />
          </StripeProvider>
        </div>
      </div>
    </RootLayout>
  );
}
