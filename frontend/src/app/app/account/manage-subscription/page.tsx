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
import { useQuery, useMutation } from "@tanstack/react-query";
import Plans from "@/app/models/Plans";
import Billing from "@/app/models/Billing";
import { useRouter } from "next/navigation";
import { capitalize } from "@/app/utils/strings";
import { uri } from "@/app/constants/routePaths";
import {proceedToPlanCheckout} from "@/app/utils/pricing";

type PlanCode = "free" | "pro" | "premium";
type ButtonProps = { code: PlanCode; name: string };

type PortalPayload = { return_url?: string };

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


  const openBillingPortal = () => {
    portalMutation.mutate({
      return_url: window.location.origin + uri.manage_subscriptions,
    });
  };

  const handleChangePlan = (targetCode: PlanCode) => {
    if (!plan) return;
    if (targetCode === effectivePlanCode) return;

    // Paid user clicking FREE -> auto cancel immediately
    if (targetCode === "free" && hasStripeSubscription) {
      const ok = confirm("Switching to Free will cancel your subscription immediately. Continue?");
      if (!ok) return;
      cancelMutation.mutate();
      return;
    }

    // Free user -> go to your checkout flow with plan + cycle
    // if (!hasStripeSubscription) {
    //   router.push(`${uri.pricing}?plan=${targetCode}&cycle=${cycleType}`);
    //   return;
    // }

    // Paid user -> confirm then open Stripe portal (Stripe handles upgrade/downgrade/payment method/cancel)
    setPendingTargetCode(targetCode);
    onOpen();
  };


  const confirmChangePlan = () => {
    onClose();
    // Stripe portal handles upgrade/downgrade/cancel/payment method
    openBillingPortal();
  };

  const goToPaymentMethodPage = () => {
    // You can keep your payment-method page, but Portal already covers this:
    openBillingPortal();
  };

  const isBusy = portalMutation.isPending || cancelMutation.isPending;

  const cycleLabel = cycleType === "monthly" ? "month" : "year";
  const subscriptionCycleLabel = subscription?.billing_cycle === "yearly" ? "year" : "month";

  const buttonLabel = (code: PlanCode) => {
    const arr: Record<PlanCode, { btnLabel: string; classnames: string }> = {
      free: {
        btnLabel: effectivePlanCode === "free" ? "Current Plan" : `Downgrade to ${capitalize(code)}`,
        classnames: "bg-gray-200 text-black",
      },
      pro: {
        btnLabel:
          effectivePlanCode === "pro"
            ? "Current Plan"
            : effectivePlanCode === "premium"
              ? `Downgrade to ${capitalize(code)}`
              : `Upgrade to ${capitalize(code)}`,
        classnames: "bg-indigo-200 text-indigo-700 font-semibold",
      },
      premium: {
        btnLabel: effectivePlanCode === "premium" ? "Current Plan" : `Upgrade to ${capitalize(code)}`,
        classnames: "bg-white text-black",
      },
    };
    return arr[code];
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-semibold text-4xl subpixel-antialiased">Manage Your Subscription</h1>
          <p className="subpixel-antialiased font-extralight text-lg px-1">
            Upgrade, downgrade, or manage your billing preferences
          </p>

          <div className="pt-5 flex items-center gap-3">
            <span className="text-sm text-slate-600">Billing cycle:</span>
            <div className="flex gap-2">
              <Button size="sm" variant={cycleType === "monthly" ? "solid" : "bordered"} onPress={() => setCycleType("monthly")} isDisabled={isBusy}>
                Monthly
              </Button>
              <Button size="sm" variant={cycleType === "yearly" ? "solid" : "bordered"} onPress={() => setCycleType("yearly")} isDisabled={isBusy}>
                Yearly
              </Button>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            {hasStripeSubscription && (
              <Button variant="bordered" className="text-sm" onPress={goToPaymentMethodPage} isDisabled={isBusy}>
                Manage billing (Stripe)
              </Button>
            )}
          </div>

          <div className="py-3" />

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600">
            <CardBody className="px-7 py-7">
              <div>
                <Chip className="bg-indigo-400 text-white text-md">CURRENT PLAN</Chip>
              </div>

              <div className="pt-3">
                <h2 className="text-white text-2xl font-semibold">{userData?.plan?.name} Plan</h2>

                <div>
                  {effectivePlanCode !== "free" && subscription ? (
                    <>
                      <span className="text-5xl text-white font-bold">${subscription?.unit_amount_dollars}</span>
                      <span className="text-xl text-white font-extralight subpixel-antialiased">/{subscriptionCycleLabel}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl text-white font-bold">$0</span>
                      <span className="text-xl text-white font-extralight subpixel-antialiased">/month</span>
                    </>
                  )}
                </div>

                <p className="pt-2 text-white font-extralight subpixel-antialiased">
                  Your next billing date is {subscription?.renews_at}.
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
                  <Card className={"w-[400px] shrink-0 " + (p.code === "pro" ? "border-blue-600 border-2" : p.code === "free" ? "border-gray-200 border-2" : p.code === "premium" ? "bg-premium-color" : "")}>
                    <CardBody className={p.code === "pro" ? "py-14" : "py-5"}>
                      <h2 className="py-1 pt-3 text-2xl font-semibold">{p.name}</h2>

                      <div className="flex flex-row items-baseline">
                        <h2 className="py-1 text-6xl font-semibold pr-2">${p.billing?.[cycleType]?.price}</h2>/{cycleLabel}
                      </div>

                      <Button
                        className={"my-8 py-6 font-semibold text-lg " + buttonLabel(code).classnames}
                        disableRipple
                        onPress={() => handleChangePlan(code)}
                        isDisabled={isBusy || isCurrent}
                      >
                        {isBusy && !isCurrent ? "Loading..." : buttonLabel(code).btnLabel}
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
