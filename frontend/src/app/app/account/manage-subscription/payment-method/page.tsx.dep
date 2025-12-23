"use client";

import React, { useEffect, useMemo, useState } from "react";
import RootLayout from "@/app/components/common/RootLayout";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Billing from "@/app/models/Billing";
import { useRouter } from "next/navigation";
import { uri } from "@/app/constants/routePaths";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function PaymentMethodForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [uiError, setUiError] = useState<string | null>(null);

  const savePaymentMethodMutation = useMutation({
    mutationFn: async (payment_method_id: string) => {
      return await Billing.updatePaymentMethod({ payment_method_id });
    },
    onSuccess: (data: any) => {
      alert(data?.message ?? "Payment method updated.");
      router.push(uri.manage_subscriptions);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update payment method.";
      setUiError(msg);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError(null);

    if (!stripe || !elements) return;

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setUiError(error.message ?? "Failed to confirm payment method.");
      return;
    }

    if (!setupIntent || setupIntent.status !== "succeeded") {
      setUiError("Setup was not completed.");
      return;
    }

    const paymentMethodId = setupIntent.payment_method as string;
    savePaymentMethodMutation.mutate(paymentMethodId);
  };

  return (
    <Card>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />

          <p className="text-xs text-slate-500">
            This will become your default payment method for future invoices/subscription charges.
          </p>

          {uiError && <p className="text-sm text-red-500">{uiError}</p>}

          <Button type="submit" color="primary" isDisabled={!stripe || savePaymentMethodMutation.isPending}>
            {savePaymentMethodMutation.isPending ? "Saving..." : "Update payment method"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

type PortalPayload = { return_url?: string };

export default function PaymentMethodPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Stripe Billing Portal redirect (low maintenance)
  const portalMutation = useMutation({
    mutationFn: async (payload: PortalPayload) => {
      return await Billing.createPortalSession(payload);
    },
    onSuccess: (data: any) => {
      const url = data?.url ?? data?.data?.url;
      if (!url) {
        alert("Portal session did not return a URL.");
        return;
      }
      window.location.href = url;
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to open Stripe portal.";
      alert(msg);
    },
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await Billing.createPaymentMethodSetupIntent({});
        if (!res?.client_secret) {
          setLoadError(res?.message ?? "Unable to load payment form.");
          return;
        }
        setClientSecret(res.client_secret);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Unable to load payment form.";
        setLoadError(msg);
      }
    };

    run();
  }, []);

  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return {
      clientSecret,
      appearance: { theme: "stripe" as const },
    };
  }, [clientSecret]);

  return (
    <RootLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Update payment method</h1>
          <p className="text-sm text-slate-600 mb-6">
            Update your card or payment method using Stripe’s secure form.
          </p>

          {/* ✅ Low maintenance: Stripe Billing Portal */}
          <Card className="mb-6">
            <CardBody className="p-6 space-y-3">
              <div>
                <h2 className="text-lg font-semibold">Manage saved cards</h2>
                <p className="text-sm text-slate-600">
                  View saved payment methods, set default card, update billing details, and more using Stripe.
                </p>
              </div>

              <Button
                variant="bordered"
                onPress={() => portalMutation.mutate({ return_url: window.location.origin + uri.manage_subscriptions })}
                isDisabled={portalMutation.isPending}
              >
                {portalMutation.isPending ? "Opening..." : "Open Stripe Billing Portal"}
              </Button>

              <p className="text-xs text-slate-500">
                You’ll be redirected to Stripe. Changes there will reflect back in Billifty automatically.
              </p>
            </CardBody>
          </Card>

          <Divider className="my-6" />

          {loadError && <p className="text-red-500">{loadError}</p>}
          {!loadError && !clientSecret && <p>Loading payment form...</p>}

          {clientSecret && options && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentMethodForm />
            </Elements>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
