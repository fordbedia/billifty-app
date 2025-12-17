"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Billing from "@/app/models/Billing";
import BSpinner from "@/app/components/Spinner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type BillingCycle = "monthly" | "yearly";
type PlanCode = "pro" | "premium";

type StripeContextValue = {
  planCode: PlanCode;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  clientSecret: string | null;
  subscriptionId: string | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  openBillingPortal: () => Promise<void>;
};

const StripeContext = createContext<StripeContextValue | null>(null);

export function useStripeBilling() {
  const ctx = useContext(StripeContext);
  if (!ctx) {
    throw new Error("useStripeBilling must be used inside <StripeProvider>");
  }
  return ctx;
}

type StripeProviderProps = {
  children: ReactNode;
  planCode: PlanCode;
  initialBillingCycle: BillingCycle;
};

export function StripeProvider({
  children,
  planCode,
  initialBillingCycle,
}: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>(initialBillingCycle);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const createIntentMutation = useMutation({
    mutationFn: async (cycle: BillingCycle) =>
      await Billing.createSubscriptionIntent({
        plan_code: planCode,
        billing_cycle: cycle,
      }),
    onSuccess: (data) => {
      setClientSecret(data.client_secret);
      setSubscriptionId(data.subscription_id ?? null);  // 👈 save it
    },
  });

  // Fire on mount & whenever billingCycle changes
  React.useEffect(() => {
    setClientSecret(null); // reset so Elements remounts with new clientSecret
    createIntentMutation.mutate(billingCycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planCode, billingCycle]);

  const portalMutation = useMutation({
    mutationFn: async () => await Billing.createPortalSession(),
  });

  const openBillingPortal = async () => {
    try {
      const data = await portalMutation.mutateAsync();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error("Failed to open billing portal", e);
    }
  };

  const value = useMemo<StripeContextValue>(
    () => ({
      planCode,
      billingCycle,
      setBillingCycle,
      clientSecret,
      subscriptionId,
      isLoading: createIntentMutation.isPending,
      isError: Boolean(createIntentMutation.error),
      errorMessage:
        (createIntentMutation.error as any)?.response?.data?.message ??
        (createIntentMutation.error as Error | undefined)?.message ??
        null,
      openBillingPortal,
    }),
    [
      planCode,
      billingCycle,
      clientSecret,
      subscriptionId,
      createIntentMutation.isPending,
      createIntentMutation.error,
      openBillingPortal,
    ]
  );

  if (createIntentMutation.isPending && !clientSecret) {
    return (
      <div className="w-full h-full flex items-center justify-center py-16">
        <BSpinner />
      </div>
    );
  }

  if (createIntentMutation.error && !clientSecret) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-16">
        <p className="text-red-500 text-sm">
          Something went wrong preparing your payment. Please try again.
        </p>
        {value.errorMessage && (
          <p className="text-xs text-red-400 mt-2">{value.errorMessage}</p>
        )}
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <StripeContext.Provider value={value}>
      <Elements
        key={clientSecret} // ensure a clean remount when clientSecret changes
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
          },
        }}
      >
        {children}
      </Elements>
    </StripeContext.Provider>
  );
}
