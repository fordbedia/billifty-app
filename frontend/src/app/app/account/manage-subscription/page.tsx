"use client";

import RootLayout from "@/app/components/common/RootLayout";
import {
  Card,
  CardBody,
  Chip,
  Image,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import Plans from "@/app/models/Plans";
import Billing from "@/app/models/Billing";
import { useRouter } from "next/navigation";
import { capitalize } from "@/app/utils/strings";
import { uri } from "@/app/constants/routePaths";

type PlanCode = "free" | "pro" | "premium";

type ButtonProps = {
  code: PlanCode;
  name: string;
};

export default function ManageSubscriptionPage() {
  const router = useRouter();
  const { userData } = useApp();

  // Monthly/Yearly toggle (added back)
  const [cycleType, setCycleType] = useState<BillingCycle>("monthly");

  const { data } = useQuery<Plan[]>({
    queryKey: ["plan"],
    queryFn: async () => (await Plans.allPlans())?.data,
    retry: false,
  });

  const plan = userData?.plan as ButtonProps | undefined;
  const subscription = userData?.subscription;
  const planCapabilities = userData?.plan_capabilities;

  // if your backend stores billing_cycle on subscription, default UI to it
  useEffect(() => {
    const subCycle = subscription?.billing_cycle as BillingCycle | undefined;
    if (subCycle === "monthly" || subCycle === "yearly") {
      setCycleType(subCycle);
    }
  }, [subscription?.billing_cycle]);

  // important: "hasStripeSubscription" means paid subscription exists
  const hasStripeSubscription = !!subscription?.stripe_subscription_id;

  // FIX for "Current plan" mismatch:
  // - use an "effective" plan code that can be updated optimistically after mutation succeeds.
  // ✅ Source of truth = subscription.plan_code (Stripe billing reality)
  const derivedPlanCode = useMemo<PlanCode>(() => {
  const subCode = subscription?.plan_code as PlanCode | undefined;
  const userPlanCode = plan?.code as PlanCode | undefined;

    if (subCode === "free" || subCode === "pro" || subCode === "premium") return subCode;
    if (userPlanCode === "free" || userPlanCode === "pro" || userPlanCode === "premium") return userPlanCode;

    return "free";
  }, [subscription?.plan_code, plan?.code]);

  // UI uses effectivePlanCode, but we only sync it forward from subscription changes
  const [effectivePlanCode, setEffectivePlanCode] = useState<PlanCode>(derivedPlanCode);

  useEffect(() => {
    // only update if derived changes (ex: subscription updated to premium)
    setEffectivePlanCode(derivedPlanCode);
  }, [derivedPlanCode]);


  const buttonLabel = (code: PlanCode, current: ButtonProps | undefined) => {
    if (!current) {
      return { btnLabel: "Loading...", href: "", classnames: "bg-gray-200 text-gray-500" };
    }

    const arr: Record<PlanCode, { btnLabel: string; href: string; classnames: string }> = {
      free: {
        btnLabel: effectivePlanCode === "free" ? "Current Plan" : `Downgrade to ${capitalize(code)}`,
        href: "",
        classnames: "bg-gray-200 text-black",
      },
      pro: {
        btnLabel:
          effectivePlanCode === "pro"
            ? "Current Plan"
            : effectivePlanCode === "premium"
              ? `Downgrade to ${capitalize(code)}`
              : `Upgrade to ${capitalize(code)}`,
        href: "",
        classnames: "bg-indigo-200 text-indigo-700 font-semibold",
      },
      premium: {
        btnLabel: effectivePlanCode === "premium" ? "Current Plan" : `Upgrade to ${capitalize(code)}`,
        href: "",
        classnames: "bg-white text-black",
      },
    };

    return arr[code];
  };

  // ----------------------------
  // Confirmation Modal State
  // ----------------------------
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [pendingTargetCode, setPendingTargetCode] = useState<PlanCode | null>(null);

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
    // simple order: free < pro < premium
    const order: Record<PlanCode, number> = { free: 0, pro: 1, premium: 2 };
    const current = order[effectivePlanCode];
    const target = order[pendingTargetCode];
    if (target > current) return "upgrade";
    if (target < current) return "downgrade";
    return null;
  }, [pendingTargetCode, effectivePlanCode]);

  // --- Mutations ---

  const changePlanMutation = useMutation({
    mutationFn: async (payload: { plan_code: PlanCode; billing_cycle: BillingCycle }) => {
      return await Billing.changePlan({
        plan_code: payload.plan_code,
        billing_cycle: payload.billing_cycle,
        proration_behavior: "create_prorations",
      });
    },
    onSuccess: (_data, variables) => {
      // optimistic update so buttons immediately show Current Plan correctly
      setEffectivePlanCode(variables.plan_code);

      // close modal
      onClose();

      // refresh safety net (keeps your behavior)
      window.location.reload();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Unable to change plan.";
      alert(msg);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await Billing.cancelSubscription({ at_period_end: true });
    },
    onSuccess: (data: any) => {
      alert(data?.message ?? "Subscription updated.");
      window.location.reload();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Unable to cancel subscription.";
      alert(msg);
    },
  });

  // --- Actions ---

  const handleChangePlan = (targetCode: PlanCode) => {
    if (!plan) return;

    if (targetCode === effectivePlanCode) return;

    // If user has NO stripe subscription (Free user), go straight to your pricing checkout
    // No modal for free -> paid (as requested)
    if (!hasStripeSubscription) {
      router.push(`${uri.pricing}?plan=${targetCode}&cycle=${cycleType}`);
      return;
    }

    // For paid users: show confirmation modal first
    setPendingTargetCode(targetCode);
    onOpen();
  };

  const confirmChangePlan = () => {
    if (!pendingTargetCode) return;

    changePlanMutation.mutate({
      plan_code: pendingTargetCode,
      billing_cycle: cycleType,
    });
  };

  const handleCancelSubscription = () => {
    if (!hasStripeSubscription) return;
    const ok = confirm("Are you sure you want to cancel your subscription?");
    if (!ok) return;
    cancelSubscriptionMutation.mutate();
  };

  const goToPaymentMethodPage = () => {
    router.push(`${uri.manage_payment_methods}`);
  };

  const isBusy = changePlanMutation.isPending || cancelSubscriptionMutation.isPending;

  // helpers for UI
  const cycleLabel = cycleType === "monthly" ? "month" : "year";
  const subscriptionCycleLabel =
    subscription?.billing_cycle === "yearly" ? "year" : "month";

  return (
    <RootLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-semibold text-4xl subpixel-antialiased">Manage Your Subscription</h1>
          <p className="subpixel-antialiased font-extralight text-lg px-1">
            Upgrade, downgrade, or manage your billing preferences
          </p>

          {/* Billing cycle toggle */}
          <div className="pt-5 flex items-center gap-3">
            <span className="text-sm text-slate-600">Billing cycle:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={cycleType === "monthly" ? "solid" : "bordered"}
                onPress={() => setCycleType("monthly")}
                isDisabled={isBusy}
              >
                Monthly
              </Button>
              <Button
                size="sm"
                variant={cycleType === "yearly" ? "solid" : "bordered"}
                onPress={() => setCycleType("yearly")}
                isDisabled={isBusy}
              >
                Yearly
              </Button>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            {hasStripeSubscription && (
              <Button variant="bordered" className="text-sm" onPress={goToPaymentMethodPage} isDisabled={isBusy}>
                Update payment method
              </Button>
            )}

            {hasStripeSubscription && (
              <Button
                color="danger"
                variant="bordered"
                className="text-sm"
                onPress={handleCancelSubscription}
                isDisabled={isBusy}
              >
                {cancelSubscriptionMutation.isPending ? "Cancelling..." : "Cancel subscription"}
              </Button>
            )}
          </div>

          <div className="py-3"></div>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600">
            <CardBody className="px-7 py-7">
              <div>
                <Chip className="bg-indigo-400 text-white text-md">CURRENT PLAN</Chip>
              </div>

              <div className="pt-3">
                <h2 className="text-white text-2xl font-semibold">{userData?.plan?.name} Plan</h2>

                <div>
                  {effectivePlanCode !== "free" && subscription && Object.keys(subscription).length > 0 ? (
                    <>
                      <span className="text-5xl text-white font-bold">${subscription?.unit_amount_dollars}</span>
                      <span className="text-xl text-white font-extralight subpixel-antialiased">
                        /{subscriptionCycleLabel}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl text-white font-bold">$0</span>
                      <span className="text-xl text-white font-extralight subpixel-antialiased">/month</span>
                    </>
                  )}
                </div>

                <p className="pt-2 text-white font-extralight subpixel-antialiased">
                  You&apos;re currently on the {userData?.plan?.name} plan. Your next billing date is {subscription?.renews_at}.
                </p>
              </div>

              <div className="flex flex-row flex-wrap gap-4">
                <Card className="bg-indigo-400 mt-5 rounded-md">
                  <CardBody>
                    <div className="text-white text-2xl">
                      {planCapabilities?.limits?.["current:invoices"]} / {planCapabilities?.limits?.max_invoices_per_month ?? "∞"}
                    </div>
                    <p className="text-white text-sm">Invoices Used</p>
                  </CardBody>
                </Card>

                <Card className="bg-indigo-400 mt-5 rounded-md">
                  <CardBody>
                    <div className="text-white text-2xl">
                      {planCapabilities?.limits?.["current:businessProfiles"]} / {planCapabilities?.limits?.max_business_profiles ?? "∞"}
                    </div>
                    <p className="text-white text-sm">Business Profiles</p>
                  </CardBody>
                </Card>

                <Card className="bg-indigo-400 mt-5 rounded-md">
                  <CardBody>
                    <div className="text-white text-2xl">
                      {planCapabilities?.limits?.["current:clients"]} / {planCapabilities?.limits?.max_clients ?? "∞"}
                    </div>
                    <p className="text-white text-sm">Total Clients</p>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>

          <div className="mb-5">
            <h2 className="text-black text-3xl font-bold pt-7">Available Plans</h2>
            <p className="text-black text-sm pt-2">Choose the plan that best fits your needs</p>
          </div>

          <div className="pricing w-full flex justify-center items-center gap-4 flex-col lg:flex-row pb-12">
            {data?.map((p) => {
              const code = p.code as PlanCode;
              const isCurrent = code === effectivePlanCode;

              return (
                <div key={p.code} className="relative w-[400px] shrink-0">
                  {p.actions?.card_label && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white rounded-md px-3 py-1 shadow text-xs">
                      {p.actions.card_label}
                    </div>
                  )}

                  <Card
                    className={
                      "w-[400px] shrink-0 " +
                      (p.code === "pro"
                        ? "border-blue-600 border-2"
                        : p.code === "free"
                          ? "border-gray-200 border-2"
                          : p.code === "premium"
                            ? "bg-premium-color"
                            : "")
                    }
                  >
                    <CardBody className={p.code === "pro" ? "py-14" : "py-5"}>
                      <div
                        className={
                          "rounded-md text-sm w-fit px-1 py-1 " +
                          (p.code === "free"
                            ? "bg-gray-200 text-black"
                            : p.code === "premium"
                              ? "bg-yellow-400 text-black"
                              : "")
                        }
                      >
                        {p.actions?.upper_text}
                      </div>

                      <h2 className="py-1 pt-3 text-2xl font-semibold">{p.name}</h2>

                      <div className="flex flex-row items-baseline">
                        <h2 className="py-1 text-6xl font-semibold pr-2">
                          ${p.billing?.[cycleType]?.price}
                        </h2>
                        /{cycleLabel}
                      </div>

                      <h3 className="font-extralight subpixel-antialiased">{p.actions?.text1}</h3>

                      <Button
                        className={"my-8 py-6 font-semibold text-lg " + buttonLabel(code, plan).classnames}
                        disableRipple
                        onPress={() => handleChangePlan(code)}
                        isDisabled={isBusy || isCurrent}
                      >
                        {changePlanMutation.isPending && !isCurrent ? "Updating..." : buttonLabel(code, plan).btnLabel}
                      </Button>

                      <Divider />

                      <ul className="pt-4">
                        {p.features_text?.map((v: any, i: number) => (
                          <li key={i} className="flex items-center gap-3 py-1 font-extralight subpixel-antialiased">
                            <div className="w-6 flex justify-center">
                              <Image alt="Check" src="/images/price/check-green.png" width="12" height="8" />
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
        </div>
      </div>

      {/* Confirmation modal (only used when hasStripeSubscription) */}
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
                  <span className="font-semibold">
                    {isUpgradeOrDowngrade === "upgrade" ? "upgrade" : "downgrade"}
                  </span>{" "}
                  to <span className="font-semibold">{capitalize(pendingTargetCode ?? "")}</span>.
                </div>

                <div className="text-sm text-slate-700">
                  Billing cycle: <span className="font-semibold">{capitalize(cycleType)}</span>
                </div>

                <div className="text-sm text-slate-700">
                  Price:{" "}
                  <span className="font-semibold">
                    ${pendingPrice ?? "—"} / {cycleLabel}
                  </span>
                </div>

                <div className="text-sm text-slate-600 pt-2">
                  This will charge your <span className="font-semibold">saved payment method</span>.
                  You can update it anytime from <span className="font-semibold">Update payment method</span>.
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} isDisabled={changePlanMutation.isPending}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmChangePlan} isDisabled={changePlanMutation.isPending}>
                  {changePlanMutation.isPending ? "Confirming..." : "Confirm"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </RootLayout>
  );
}
