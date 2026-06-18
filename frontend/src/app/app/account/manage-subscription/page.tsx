"use client";

import RootLayout from "@/app/components/common/RootLayout";
import {
  Card,
  CardBody,
  Chip,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useApp } from "@/app/providers/AppContext";
import { useEffect, useMemo, useState } from "react";
import { BillingCycle, Plan } from "@/app/app/invoice/pricing/page";
import { useQuery, useMutation } from "@tanstack/react-query";
import Plans from "@/app/models/Plans";
import Billing from "@/app/models/Billing";
import { useRouter } from "next/navigation";
import { capitalize } from "@/app/utils/strings";
import { uri } from "@/app/constants/routePaths";
import { directionFlow, proceedToPlanCheckout } from "@/app/utils/pricing";
import { auth } from "@/app/helpers/auth";
import { formattedDate } from "@/app/utils/date";

type PlanCode = "free" | "pro" | "premium";
type ButtonProps = { code: PlanCode; name: string };

type PortalPayload = { return_url?: string };
type FAQItem = { question: string; answer: string[] };

const CURRENT_PLAN_GRADIENT = "from-[#070C22] via-[#10172F] to-[#151B38]";

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I upgrade my plan?",
    answer: [
      "Choose the higher plan you want on this page, then click the upgrade button under that plan.",
      "After you confirm, you will be taken to Stripe to complete the change securely.",
      "Once Stripe confirms the update, your subscription will move to the new plan.",
    ],
  },
  {
    question: "How do I change or downgrade my plan?",
    answer: [
      "Select the plan you want to move to and click the button shown for that plan.",
      "We will open Stripe so you can review and confirm the plan change using the same secure billing flow.",
      "Your billing settings and subscription details stay connected to the same account.",
    ],
  },
  {
    question: "How do I download invoices or billing receipts?",
    answer: [
      "Click Manage Billing or Open Stripe Billing in the billing section on this page.",
      "Inside Stripe, open your invoice history and choose the invoice or receipt you want to download.",
      "Stripe provides the downloadable billing documents for your subscription.",
    ],
  },
  {
    question: "What happens if I downgrade to the Free plan?",
    answer: [
      "If you downgrade from a paid plan to Free, your current paid access will remain available until your current billing cycle ends.",
      "The downgrade does not remove paid access immediately. The Free plan takes effect after the active billing period lapses.",
      "After that date, your account will continue on the Free plan with Free plan limits and features.",
    ],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ManageSubscriptionPage() {
  const router = useRouter();
  const { userData } = useApp();

  const [cycleType, setCycleType] = useState<BillingCycle>("monthly");

  const { data } = useQuery<Plan[]>({
    queryKey: ["plan"],
    queryFn: async () => (await Plans.allPlans())?.data,
    retry: false,
  });

  const plan = userData?.plan as ButtonProps | undefined;
  const subscription = userData?.subscription;
  const planCapabilities = userData?.plan_capabilities;

  useEffect(() => {
    const subCycle = subscription?.billing_cycle as BillingCycle | undefined;
    if (subCycle === "monthly" || subCycle === "yearly") setCycleType(subCycle);
  }, [subscription?.billing_cycle]);

  const hasStripeSubscription = !!subscription?.stripe_subscription_id;

  const derivedPlanCode = useMemo<PlanCode>(() => {
    const subCode = subscription?.plan_code as PlanCode | undefined;
    const userPlanCode = plan?.code as PlanCode | undefined;

    if (subCode === "free" || subCode === "pro" || subCode === "premium") return subCode;
    if (userPlanCode === "free" || userPlanCode === "pro" || userPlanCode === "premium") return userPlanCode;

    return "free";
  }, [subscription?.plan_code, plan?.code]);

  const [effectivePlanCode, setEffectivePlanCode] = useState<PlanCode>(derivedPlanCode);

  useEffect(() => setEffectivePlanCode(derivedPlanCode), [derivedPlanCode]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [pendingTargetCode, setPendingTargetCode] = useState<PlanCode | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const pendingPlan = useMemo(() => {
    if (!pendingTargetCode || !data) return null;
    return data.find((p) => p.code === pendingTargetCode) ?? null;
  }, [pendingTargetCode, data]);

  const pendingPrice = useMemo(() => {
    if (!pendingPlan) return null;
    return pendingPlan.billing?.[cycleType]?.price ?? null;
  }, [pendingPlan, cycleType]);

  const isUpgradeOrDowngrade = useMemo(() => {
    if (!pendingTargetCode) return null;
    const order: Record<PlanCode, number> = { free: 0, pro: 1, premium: 2 };
    const current = order[effectivePlanCode];
    const target = order[pendingTargetCode];
    if (target > current) return "upgrade";
    if (target < current) return "downgrade";
    return null;
  }, [pendingTargetCode, effectivePlanCode]);

  const portalMutation = useMutation({
    mutationFn: async (payload: PortalPayload) => await Billing.createPortalSession(payload),
    onSuccess: (data: any) => {
      const url = data?.url ?? data?.data?.url;
      if (!url) return alert("Portal session did not return a URL.");
      window.location.href = url;
    },
    onError: (err: any) => {
      setIsRedirecting(false);
      const msg = err?.response?.data?.message || err?.message || "Unable to open Stripe portal.";
      alert(msg);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => await Billing.cancelSubscription({}),
    onSuccess: (data: any) => {
      alert(data?.message ?? "Subscription canceled.");
      window.location.reload();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Unable to cancel subscription.";
      alert(msg);
    },
  });

  const openPaymentStripePortal = async () => {
    setIsRedirecting(true);
    const kind = await directionFlow("manageSubscription");
    const code = pendingTargetCode;

    if (kind === "billing_portal") {
      portalMutation.mutate({
        return_url: window.location.origin + uri.manage_subscriptions,
      });
      return;
    }
    if (!code) {
      setIsRedirecting(false);
      return;
    }
    if (kind === "checkout") {
      const session = auth();
      await proceedToPlanCheckout(code, cycleType, planCapabilities, session, router);
    }
  };

  const handleChangePlan = async (targetCode: PlanCode) => {
    if (!plan) return;
    const kind = await directionFlow("manageSubscription");
    if (targetCode === effectivePlanCode) return;

    // Paid user clicking FREE -> auto cancel immediately
    if (kind === "billing_portal") {
      setIsRedirecting(true);
      portalMutation.mutate({
        return_url: window.location.origin + uri.manage_subscriptions,
      });
      return;
    }

    // Paid user -> confirm then open Stripe portal (Stripe handles upgrade/downgrade/payment method/cancel)
    setPendingTargetCode(targetCode);
    onOpen();
  };


  const confirmChangePlan = () => {
    onClose();
    // Stripe portal handles upgrade/downgrade/cancel/payment method
    openPaymentStripePortal();
  };

  const goToPaymentMethodPage = () => {
    // You can keep your payment-method page, but Portal already covers this:
    openPaymentStripePortal();
  };

  const isBusy = isRedirecting || portalMutation.isPending || cancelMutation.isPending;

  const cycleLabel = cycleType === "monthly" ? "month" : "year";
  const subscriptionCycleLabel = subscription?.billing_cycle === "yearly" ? "year" : "month";
  const orderedPlans = data ?? [];

  const currentPlanName = userData?.plan?.name ?? capitalize(effectivePlanCode);
  const currentPrice =
    effectivePlanCode !== "free" && subscription?.unit_amount_dollars
      ? subscription.unit_amount_dollars
      : 0;
  const nextBillingDate = subscription?.renews_at ? formattedDate(subscription.renews_at) : "No renewal date available";
  const hasCancellationDate = subscription?.cancels_at ?? false;
  const cancellationDate = subscription?.cancels_at ? formattedDate(subscription.cancels_at) : null;
  const planStartedAt = subscription?.created_at ? formattedDate(subscription.created_at) : null;
  const currentStatus = capitalize(subscription?.status ?? (hasStripeSubscription ? "active" : "free"));
  const usageCards = [
    {
      label: "Invoices Used",
      value: `${planCapabilities?.limits?.["current:invoices"] ?? 0} / ${planCapabilities?.limits?.max_invoices_per_month ?? "∞"}`,
    },
    {
      label: "Business Profiles",
      value: `${planCapabilities?.limits?.["current:businessProfiles"] ?? 0} / ${planCapabilities?.limits?.max_business_profiles ?? "∞"}`,
    },
    {
      label: "Total Clients",
      value: `${planCapabilities?.limits?.["current:clients"] ?? 0} / ${planCapabilities?.limits?.max_clients ?? "∞"}`,
    },
  ];

  const buttonLabel = (code: PlanCode) => {
    const arr: Record<PlanCode, { btnLabel: string; classnames: string }> = {
      free: {
        btnLabel: effectivePlanCode === "free" ? "Current Plan" : `Downgrade to ${capitalize(code)}`,
        classnames:
          "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200",
      },
      pro: {
        btnLabel:
          effectivePlanCode === "pro"
            ? "Current Plan"
            : effectivePlanCode === "premium"
              ? `Downgrade to ${capitalize(code)}`
              : `Upgrade to ${capitalize(code)}`,
        classnames:
          "bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30",
      },
      premium: {
        btnLabel: effectivePlanCode === "premium" ? "Current Plan" : `Upgrade to ${capitalize(code)}`,
        classnames:
          "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500",
      },
    };
    return arr[code];
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-[#fbfbfc] px-4 py-10 text-slate-950 sm:py-12">
        <div className="mx-auto max-w-[980px]">
          <section className="mx-auto max-w-[650px] text-center">
            <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/70">
              <Button
                size="sm"
                radius="full"
                className={cn(
                  "h-8 min-w-24 border-0 px-5 text-xs font-semibold",
                  cycleType === "monthly"
                    ? "bg-[#070C22] text-white shadow-sm"
                    : "bg-transparent text-slate-500 hover:bg-slate-50"
                )}
                onPress={() => setCycleType("monthly")}
                isDisabled={isBusy}
              >
                Monthly
              </Button>
              <Button
                size="sm"
                radius="full"
                className={cn(
                  "h-8 min-w-24 border-0 px-5 text-xs font-semibold",
                  cycleType === "yearly"
                    ? "bg-[#070C22] text-white shadow-sm"
                    : "bg-transparent text-slate-500 hover:bg-slate-50"
                )}
                onPress={() => setCycleType("yearly")}
                isDisabled={isBusy}
              >
                Yearly
              </Button>
            </div>

            <h1 className="text-[34px] font-extrabold tracking-[-0.035em] text-[#121827] sm:text-[40px]">
              Manage Your Subscription
            </h1>
            <p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">
              Choose the plan that fits your business, adjust billing preferences,
              and manage your subscription without changing the content already tied to your account.
            </p>
          </section>

          <section className="mx-auto mt-9 max-w-[720px]">
            <Card className={cn("overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r shadow-[0_28px_60px_-34px_rgba(7,12,34,0.85)]", CURRENT_PLAN_GRADIENT)}>
              <CardBody className="px-6 py-6 text-white sm:px-7 sm:py-7">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-4">
                    <Chip className="h-6 border border-white/15 bg-white/10 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      Current Plan
                    </Chip>

                    <div>
                      <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-[28px]">
                        {currentPlanName} Plan
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {planStartedAt ? `Active since ${planStartedAt}` : "Your plan is active and ready to use."}
                      </p>
                    </div>

                    <div className="flex items-end gap-2 pt-1">
                      <span className="text-[38px] font-extrabold leading-none tracking-[-0.035em] sm:text-[44px]">${currentPrice}</span>
                      <span className="pb-1.5 text-sm text-slate-300">/{subscriptionCycleLabel}</span>
                    </div>
                  </div>

                  <div className="w-full rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm md:max-w-[340px]">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Status</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        {currentStatus}
                      </span>
                    </div>
                    <Divider className="my-4 bg-white/10" />
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {hasCancellationDate ? 'Cancellation Date' : 'Next Billing Date'}
                      </p>
                      <p className="text-sm font-semibold text-white">
                          {hasCancellationDate ? cancellationDate : nextBillingDate}
                      </p>
                    </div>
                    <Button
                      className="mt-5 h-10 w-full rounded-md border-0 bg-white text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50"
                      onPress={goToPaymentMethodPage}
                      isDisabled={isBusy || !hasStripeSubscription}
                    >
                      {hasStripeSubscription ? "Manage Billing" : "Billing Unavailable"}
                    </Button>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                  {usageCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-md border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-xl font-bold tracking-[-0.02em] text-white">{item.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="mt-11">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-[#121827]">Choose Your Plan</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Keep the same subscription content and switch only the plan level that powers it.
              </p>
            </div>

            <div className="mx-auto grid max-w-[820px] gap-5 md:grid-cols-2 lg:grid-cols-3">
              {orderedPlans.map((p) => {
                const code = p.code as PlanCode;
                const isCurrent = code === effectivePlanCode;
                const isFeatured = code === "pro";

                return (
                  <div key={p.code} className="relative">
                    {isFeatured && (
                      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B4BFF] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-indigo-400/25">
                        Most Popular
                      </div>
                    )}
                    <Card
                      className={cn(
                        "h-full rounded-xl border border-slate-200 bg-white shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)]",
                        isFeatured && "border-[#5B4BFF] shadow-[0_24px_60px_-42px_rgba(91,75,255,0.7)]"
                      )}
                    >
                      <CardBody className={cn("flex h-full flex-col px-5 py-7", isFeatured && "pt-9")}>
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-[#121827]">{p.name}</h3>
                          <p className="mt-1.5 min-h-9 text-xs leading-5 text-slate-500">
                            {p.description}
                          </p>
                        </div>

                        <div className="mt-5 flex items-end justify-center gap-1.5 text-center">
                          <span className="text-[32px] font-extrabold leading-none tracking-[-0.035em] text-[#121827]">${p.billing?.[cycleType]?.price}</span>
                          <span className="pb-1 text-xs text-slate-500">/{cycleLabel}</span>
                        </div>

                        <div className="mt-5">
                          {isCurrent && (
                            <div className="mb-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-center text-xs font-semibold text-[#5B4BFF]">
                              Your Current Plan
                            </div>
                          )}
                          <Button
                            className={cn(
                              "h-10 w-full rounded-md py-0 text-xs font-semibold",
                              buttonLabel(code).classnames,
                              isCurrent && "bg-slate-200 text-slate-500 opacity-100"
                            )}
                            disableRipple
                            onPress={() => handleChangePlan(code)}
                            isDisabled={isBusy || isCurrent}
                          >
                            {isBusy && !isCurrent ? "Loading..." : buttonLabel(code).btnLabel}
                          </Button>
                        </div>

                        <Divider className="my-6 bg-slate-100" />

                        <ul className="space-y-3">
                          {p.features_text?.map((v: any, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs leading-5 text-slate-700">
                              <div
                                className={cn(
                                  "mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                  code === "free"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : code === "pro"
                                      ? "bg-blue-50 text-blue-600"
                                      : "bg-violet-50 text-violet-600"
                                )}
                              >
                                ✓
                              </div>
                              {v}
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <Card className="border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <CardBody className="px-6 py-6 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Billing Information</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review your active subscription details without changing existing account content.
                    </p>
                  </div>
                  {hasStripeSubscription && (
                    <Button
                      variant="bordered"
                      className="h-8 min-w-24 border-0 px-5 text-xs font-semibold bg-slate-200 text-slate-500 opacity-100"
                      onPress={goToPaymentMethodPage}
                      isDisabled={isBusy}
                    >
                      Open Billing
                    </Button>
                  )}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Subscription Summary
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-3">
                        <span>Current plan</span>
                        <span className="font-semibold text-slate-900">{currentPlanName}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Billing cycle</span>
                        <span className="font-semibold text-slate-900">{capitalize(subscription?.billing_cycle ?? "monthly")}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Status</span>
                        <span className="font-semibold text-slate-900">{currentStatus}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Renewal</span>
                        <span className="font-semibold text-slate-900">{nextBillingDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Billing Access
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <p>
                        Payment methods, invoices, and subscription changes are handled through
                        Stripe for security.
                      </p>
                      <p>
                        {hasStripeSubscription
                          ? "Use the billing action to update cards, review invoices, or confirm plan changes."
                          : "A Stripe billing portal becomes available once a paid subscription is active."}
                      </p>
                    </div>
                    <Button
                      className="mt-5 w-full bg-slate-900 text-white"
                      onPress={goToPaymentMethodPage}
                      isDisabled={isBusy || !hasStripeSubscription}
                    >
                      {hasStripeSubscription ? "Manage Billing Settings" : "No Active Billing Portal"}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <CardBody className="px-6 py-6 sm:px-8">
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
                <div className="mt-6 space-y-4">
                  {FAQ_ITEMS.map((item, index) => {
                    const isFaqOpen = openFaqIndex === index;

                    return (
                      <div key={item.question} className="rounded-2xl bg-slate-50 p-5">
                        <button
                          type="button"
                          className="flex w-full items-start justify-between gap-4 text-left"
                          onClick={() => setOpenFaqIndex(isFaqOpen ? null : index)}
                          aria-expanded={isFaqOpen}
                        >
                          <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg leading-none text-slate-500 transition-transform",
                              isFaqOpen && "rotate-45"
                            )}
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </button>

                        {isFaqOpen && (
                          <div className="mt-3 space-y-2">
                            {item.answer.map((paragraph) => (
                              <p key={paragraph} className="text-sm leading-6 text-slate-600">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                  <h2 className="px-5 py-3">Confirm {isUpgradeOrDowngrade === "upgrade" ? "Upgrade" : "Downgrade"}</h2>
              </ModalHeader>
              <ModalBody>
                <div className="text-sm text-slate-700">
                  You are about to{" "}
                  <span className="font-semibold">{isUpgradeOrDowngrade === "upgrade" ? "upgrade" : "downgrade"}</span>{" "}
                  to <span className="font-semibold">{capitalize(pendingTargetCode ?? "")}</span>.
                </div>
                <div className="text-sm text-slate-700">
                  Billing cycle: <span className="font-semibold">{capitalize(cycleType)}</span>
                </div>
                <div className="text-sm text-slate-700">
                  Price: <span className="font-semibold">${pendingPrice ?? "—"} / {cycleLabel}</span>
                </div>
                <div className="text-sm text-slate-600 pt-2">
                  We’ll open Stripe’s secure billing portal to confirm and manage billing.
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} isDisabled={isBusy}>Cancel</Button>
                <Button color="primary" onPress={confirmChangePlan} isDisabled={isBusy}>
                  {isBusy ? "Opening..." : "Continue"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </RootLayout>
  );
}
