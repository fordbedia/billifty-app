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

const PLAN_ORDER: PlanCode[] = ["free", "pro", "premium"];
const CURRENT_PLAN_GRADIENT = "from-[#247CFF] via-[#4467FF] to-[#8B3DFF]";

const FAQ_ITEMS = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes. You can upgrade or downgrade at any time. Plan changes continue through the same secure billing flow you already use.",
  },
  {
    question: "How do I update billing details or payment methods?",
    answer:
      "Use the billing management action below. It opens Stripe so you can securely update payment methods and subscription settings.",
  },
  {
    question: "What happens if I move to the Free plan?",
    answer:
      "Your workspace stays available, but your account will follow the limits and features included with the Free plan.",
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
  const orderedPlans =
    PLAN_ORDER.map((code) => data?.find((item) => item.code === code)).filter(
      (item): item is Plan => Boolean(item)
    ) ?? [];

  const currentPlanName = userData?.plan?.name ?? capitalize(effectivePlanCode);
  const currentPrice =
    effectivePlanCode !== "free" && subscription?.unit_amount_dollars
      ? subscription.unit_amount_dollars
      : 0;
  const nextBillingDate = subscription?.renews_at ? formattedDate(subscription.renews_at) : "No renewal date available";
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
          "bg-gradient-to-r from-[#247CFF] to-[#8B3DFF] text-white shadow-lg shadow-blue-500/20",
      },
      premium: {
        btnLabel: effectivePlanCode === "premium" ? "Current Plan" : `Upgrade to ${capitalize(code)}`,
        classnames:
          "bg-slate-900 text-white hover:bg-slate-800",
      },
    };
    return arr[code];
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,124,255,0.12),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f6f8fc_48%,#ffffff_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <section className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-white/80 bg-white/90 px-2 py-2 shadow-sm shadow-slate-200/70 backdrop-blur">
              <Button
                size="sm"
                radius="full"
                className={cn(
                  "min-w-28 border-0 font-medium",
                  cycleType === "monthly"
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-600"
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
                  "min-w-28 border-0 font-medium",
                  cycleType === "yearly"
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-600"
                )}
                onPress={() => setCycleType("yearly")}
                isDisabled={isBusy}
              >
                Yearly
              </Button>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Manage Your Subscription
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Choose the plan that fits your business, adjust billing preferences,
              and manage your subscription without changing the content already tied to your account.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-3xl">
            <Card className={cn("overflow-hidden border-0 bg-gradient-to-r", CURRENT_PLAN_GRADIENT)}>
              <CardBody className="px-6 py-7 text-white sm:px-8 sm:py-9">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-4">
                    <Chip className="border border-white/20 bg-white/15 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      Current Plan
                    </Chip>

                    <div>
                      <h2 className="text-3xl font-semibold sm:text-4xl">
                        {currentPlanName} Plan
                      </h2>
                      <p className="mt-2 text-sm text-white/80">
                        {planStartedAt ? `Active since ${planStartedAt}` : "Your plan is active and ready to use."}
                      </p>
                    </div>

                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-bold sm:text-6xl">${currentPrice}</span>
                      <span className="pb-2 text-base text-white/80">/{subscriptionCycleLabel}</span>
                    </div>
                  </div>

                  <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Status</span>
                      <span className="font-semibold text-white">{currentStatus}</span>
                    </div>
                    <Divider className="my-3 bg-white/15" />
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                        Next Billing Date
                      </p>
                      <p className="text-base font-semibold">{nextBillingDate}</p>
                    </div>
                    <Button
                      className="mt-4 w-full border-0 bg-white text-[#3158ff] font-semibold"
                      onPress={goToPaymentMethodPage}
                      isDisabled={isBusy || !hasStripeSubscription}
                    >
                      {hasStripeSubscription ? "Manage Billing" : "Billing Unavailable"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {usageCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/15 bg-white/12 px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-semibold">{item.value}</p>
                      <p className="mt-1 text-sm text-white/80">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="mt-14">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Choose Your Plan</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Keep the same subscription content and switch only the plan level that powers it.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {orderedPlans.map((p) => {
              const code = p.code as PlanCode;
              const isCurrent = code === effectivePlanCode;
              const isFeatured = code === "pro";

              return (
                <div key={p.code} className="relative">
                  {isFeatured && (
                    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#247CFF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-400/25">
                      Most Popular
                    </div>
                  )}
                  <Card
                    className={cn(
                      "h-full border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
                      isCurrent && "border-[#7C4DFF] shadow-[0_24px_60px_rgba(124,77,255,0.18)]",
                      isFeatured && "border-[#247CFF]"
                    )}
                  >
                    <CardBody className={cn("flex h-full flex-col px-6 py-8", isFeatured && "pt-10")}>
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold">{p.name}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {code === "free"
                            ? "Best for getting started"
                            : code === "pro"
                              ? "Best for growing businesses"
                              : "For larger teams and higher usage"}
                        </p>
                      </div>

                      <div className="mt-8 flex items-end justify-center gap-2 text-center">
                        <span className="text-5xl font-bold text-slate-900">${p.billing?.[cycleType]?.price}</span>
                        <span className="pb-2 text-sm text-slate-500">/{cycleLabel}</span>
                      </div>

                      <div className="mt-8">
                        {isCurrent && (
                          <div className="mb-3 rounded-full bg-gradient-to-r from-[#247CFF]/10 to-[#8B3DFF]/10 px-4 py-2 text-center text-sm font-semibold text-[#3158ff]">
                            Your Current Plan
                          </div>
                        )}
                      <Button
                        className={cn(
                          "h-12 w-full py-6 text-base font-semibold",
                          buttonLabel(code).classnames
                        )}
                        disableRipple
                        onPress={() => handleChangePlan(code)}
                        isDisabled={isBusy || isCurrent}
                      >
                        {isBusy && !isCurrent ? "Loading..." : buttonLabel(code).btnLabel}
                      </Button>
                      </div>

                      <Divider className="my-6" />

                      <ul className="space-y-3">
                        {p.features_text?.map((v: any, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <div
                              className={cn(
                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
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
                      className="border-slate-300 text-slate-700"
                      onPress={goToPaymentMethodPage}
                      isDisabled={isBusy}
                    >
                      Open Stripe Billing
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
                  {FAQ_ITEMS.map((item) => (
                    <div key={item.question} className="rounded-2xl bg-slate-50 p-5">
                      <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                    </div>
                  ))}
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
                Confirm {isUpgradeOrDowngrade === "upgrade" ? "Upgrade" : "Downgrade"}
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
