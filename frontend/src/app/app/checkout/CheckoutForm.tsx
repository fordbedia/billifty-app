"use client";

import React from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useStripeBilling } from "@/app/providers/StripeProvider";
import BSpinner from "@/app/components/Spinner";
import { uri } from "@/app/constants/routePaths";
import Billing from "@/app/models/Billing";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const {
    planCode,
    billingCycle,
    setBillingCycle,
    isLoading,
    openBillingPortal,
    subscriptionId,
  } = useStripeBilling();

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setError(null);

    if (!stripe || !elements) return;
    if (!subscriptionId) {
      setErrorMessage("No subscription prepared. Please reload the page.");
      return;
    }

    setIsSubmitting(true);
    setSubmitting(true);

    // 1) Confirm the payment with Stripe (no redirect)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // optional: return_url if you want redirect fallback
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed.");
      setIsSubmitting(false);
      setSubmitting(false);
      return;
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setErrorMessage(
        `Payment is not completed yet (status: ${
          paymentIntent?.status ?? "unknown"
        }).`
      );
      setIsSubmitting(false);
      setSubmitting(false);
      return;
    }

    // 2) Notify backend that subscription is now truly active
    try {
      const c = await Billing.confirmSubscription({
        subscription_id: subscriptionId,
        plan_code: planCode,
        billing_cycle: billingCycle,
        // 👇 NEW: send the PaymentIntent ID so backend can verify with Stripe
        payment_intent_id: paymentIntent.id,
      });

      setSuccess(true);
      sessionStorage.setItem("success_checkout", JSON.stringify(c));

      // 3) Optional: refetch /me so plan_capabilities updates
      // e.g. queryClient.invalidateQueries(['me'])

      // 4) Redirect to success / dashboard
      window.location.href = uri.checkout_success; // adjust path as needed
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to finalize your subscription.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const displayPrice = () => {
    if (planCode === "pro") {
      return billingCycle === "monthly" ? "$4.99" : "$49.99";
    }

    return billingCycle === "monthly" ? "$9.99" : "$99.99";
  };

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment column */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <p className="text-xs text-slate-500 mb-4">
          Your saved cards and payment methods (Apple Pay, Google Pay, etc.)
          will appear here automatically.
        </p>

        {isLoading && (
          <div className="w-full flex justify-center py-6">
            <BSpinner />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />

          {errorMessage && (
            <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-emerald-500 mt-2">
              Payment successful! Redirecting…
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
            <button
              type="button"
              onClick={openBillingPortal}
              className="text-xs underline text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Manage saved payment methods
            </button>

            <button
              type="submit"
              disabled={!stripe || !elements || submitting}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <BSpinner />
                  <span className="ml-2 text-xs">Processing…</span>
                </>
              ) : (
                <>Confirm and pay</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-900 text-slate-50 rounded-2xl shadow-md p-6 flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Order Summary
          </p>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              {planCode === "pro" ? "Pro Plan" : "Premium Plan"}
            </h3>

            {/* Billing cycle toggle */}
            <div className="inline-flex items-center rounded-full bg-slate-800 p-1 text-[11px]">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-2 py-1 rounded-full ${
                  billingCycle === "monthly"
                    ? "bg-slate-50 text-slate-900 font-semibold"
                    : "text-slate-300"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-2 py-1 rounded-full ${
                  billingCycle === "yearly"
                    ? "bg-slate-50 text-slate-900 font-semibold"
                    : "text-slate-300"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold">{displayPrice()}</span>
            <span className="text-xs text-slate-300">
              / {billingCycle === "monthly" ? "month" : "year"}
            </span>
          </div>

          {billingCycle === "yearly" && (
            <p className="text-[11px] text-emerald-300">
              You’re saving ~20% with yearly billing.
            </p>
          )}

          <div className="mt-6 space-y-2 text-xs text-slate-200">
            <p>✓ Unlimited invoices</p>
            <p>✓ Priority email support</p>
            {planCode === "premium" && <p>✓ Online payments & automation</p>}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          You can update your billing details or change your payment method
          anytime via the Billing Portal.
        </p>
      </div>
    </div>
  );
}
