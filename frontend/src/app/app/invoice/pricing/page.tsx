"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import RootLayout from "@/app/components/common/RootLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Divider, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Plans from "@/app/models/Plans";
import CompareFeaturesTable from "@/app/app/invoice/pricing/CompareFeaturesTable";
import { useApp } from "@/app/providers/AppContext";
import { auth } from "@/app/helpers/auth";
import { uri } from "@/app/constants/routePaths";
import {
  directionFlow,
  proceedToBillingPortal,
  proceedToPlanCheckout,
} from "@/app/utils/pricing";

export type BillingCycle = "monthly" | "yearly";

export type BillingDetails = {
  price: number;
};

export type Plan = {
  billing: Record<BillingCycle, BillingDetails>;
  actions: Record<string, any>;
  code: string;
  features: Record<string, any>;
  limits: Record<string, any>;
  name: string;
  monthly: number;
  yearly: number;
  features_text: string[];
};

const PLAN_ORDER = ["free", "pro", "premium"] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLimitRows(plan: Plan) {
  if (plan.code === "free") {
    return [
      {
        alt: "Free Business Profile",
        height: 14,
        label: `${plan.limits?.business_profiles} Business Profile`,
        src: "/images/price/free-bp.png",
        width: 10,
      },
      {
        alt: "Free Client",
        height: 14,
        label: `Up to ${plan.limits?.clients} Clients`,
        src: "/images/price/free-clients.png",
        width: 17,
      },
      {
        alt: "Free Invoice",
        height: 14,
        label: `Up to ${plan.limits?.invoices_per_month} Invoices`,
        src: "/images/price/free-invoice.png",
        width: 10,
      },
    ];
  }

  if (plan.code === "pro") {
    return [
      {
        alt: "Pro Business Profile",
        height: 14,
        label: `${plan.limits?.business_profiles} Business Profiles`,
        src: "/images/price/pro-bp.png",
        width: 10,
      },
      {
        alt: "Pro Client",
        height: 14,
        label: "Unlimited Clients",
        src: "/images/price/pro-clients.png",
        width: 17,
      },
      {
        alt: "Pro Invoice",
        height: 14,
        label: `Up to ${plan.limits?.invoices_per_month} invoices/month`,
        src: "/images/price/pro-invoice.png",
        width: 10,
      },
    ];
  }

  return [
    {
      alt: "Premium Business Profiles",
      height: 9,
      label: `${plan.limits?.business_profiles} Business Profiles`,
      src: "/images/price/premium-limits.png",
      width: 18,
    },
    {
      alt: "Premium Clients",
      height: 8,
      label: "Unlimited Clients",
      src: "/images/price/premium-limits.png",
      width: 17,
    },
    {
      alt: "Premium Invoices",
      height: 8,
      label: "Unlimited Invoices",
      src: "/images/price/premium-limits.png",
      width: 17,
    },
  ];
}

function getFeatureIcon(planCode: string, isLastFreeItem: boolean) {
  if (planCode === "free" && isLastFreeItem) {
    return {
      alt: "Info Icon",
      src: "/images/price/info-icon.png",
    };
  }

  if (planCode === "free") {
    return {
      alt: "Check Green Icon",
      src: "/images/price/check-green.png",
    };
  }

  if (planCode === "pro") {
    return {
      alt: "Check Pro Icon",
      src: "/images/price/check-pro.png",
    };
  }

  return {
    alt: "Check Premium Icon",
    src: "/images/price/check-premium.png",
  };
}

export function PricingComponent() {
  const { userData } = useApp();
  const session = auth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cycleType, setCycleType] = useState<BillingCycle>("monthly");
  const planCapabilities = userData?.plan_capabilities;
  const hasRun = useRef<boolean>(false);

  const autoCheckout = searchParams.get("auto_checkout");
  const selectedPlanCode = searchParams.get("plan_code");
  const selectedBillingCycle = searchParams.get("billing_cycle");

  const isBillingCycle = (value: string | null): value is BillingCycle =>
    value === "monthly" || value === "yearly";

  useEffect(() => {
    if (hasRun.current) return;
    if (!isBillingCycle(selectedBillingCycle)) return;
    if (!autoCheckout || !selectedPlanCode) return;

    hasRun.current = true;

    proceedToPlanCheckout(
      selectedPlanCode,
      selectedBillingCycle,
      planCapabilities ?? [],
      session,
      router
    );
  }, [
    autoCheckout,
    planCapabilities,
    router,
    selectedBillingCycle,
    selectedPlanCode,
    session,
  ]);

  const { data } = useQuery<Plan[]>({
    queryKey: ["plan"],
    queryFn: async () => (await Plans.allPlans())?.data,
    retry: false,
  });

  const orderedPlans =
    PLAN_ORDER.map((code) => data?.find((plan) => plan.code === code)).filter(
      (plan): plan is Plan => Boolean(plan)
    ) ?? [];

  const moveToCompareSection = () => {
    const compareSection = document.getElementById("compare-features-table");
    if (!compareSection) return;

    const scrollY = compareSection.getBoundingClientRect().top + window.scrollY - 32;
    window.scrollTo({ top: scrollY, behavior: "smooth" });
  };

  const handlePlanButton = async (
    code: string,
    currentCycleType: BillingCycle,
    currentPlanCapabilities: any,
    currentSession: any,
    currentRouter: any
  ) => {
    const kind = await directionFlow("pricing");

    if (kind === "checkout") {
      await proceedToPlanCheckout(
        code,
        currentCycleType,
        currentPlanCapabilities,
        currentSession,
        currentRouter
      );
      return;
    }

    if (kind === "billing_portal") {
      await proceedToBillingPortal({
        return_url: window.location.origin + uri.manage_subscriptions,
      });
      return;
    }

    if (kind === "manage_subscription") {
      currentRouter.push(uri.manage_subscriptions);
      return;
    }

    currentRouter.push(
      `/auth?next=${encodeURIComponent(
        `${uri.pricing}?plan_code=${code}&billing_cycle=${currentCycleType}`
      )}`
    );
  };

  return (
    <RootLayout>
      <section className="relative overflow-hidden bg-[#fbf7ff]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-72 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="subpixel-antialiased py-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Simple pricing for powerful invoices
            </h1>
            <p className="subpixel-antialiased py-3 text-base font-light text-slate-600 sm:text-lg">
              Start free, then scale as your business grows.
            </p>
            <p className="subpixel-antialiased text-base font-light text-slate-600 sm:text-lg">
              Billifty is designed for freelancers and small business owners who
              need professional invoicing without the complexity.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                disableRipple
                className="btn-colored min-w-[200px] px-6 py-6 text-base font-semibold shadow-lg shadow-indigo-200 sm:text-lg"
              >
                Get started free
              </Button>
              <Button
                disableRipple
                onPress={moveToCompareSection}
                variant="bordered"
                className="min-w-[200px] border-slate-300 bg-white/80 px-6 py-6 text-base font-semibold text-slate-700 shadow-sm backdrop-blur sm:text-lg"
              >
                View all features
              </Button>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="inline-flex rounded-full border border-white/80 bg-white/90 p-1 shadow-lg shadow-slate-200/80 backdrop-blur">
                {(["monthly", "yearly"] as BillingCycle[]).map((billingCycle) => {
                  const isActive = billingCycle === cycleType;

                  return (
                    <button
                      key={billingCycle}
                      type="button"
                      onClick={() => setCycleType(billingCycle)}
                      className={cn(
                        "rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition sm:px-8",
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "text-slate-600"
                      )}
                    >
                      {billingCycle}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-14 grid gap-6 lg:grid-cols-3 lg:items-end">
            {orderedPlans.map((plan) => {
              const isFree = plan.code === "free";
              const isPro = plan.code === "pro";
              const isPremium = plan.code === "premium";

              return (
                <div
                  key={plan.code}
                  className={cn("relative", isPro && "lg:-translate-y-6")}
                >
                  {plan.actions?.card_label && (
                    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg shadow-amber-200/80">
                      {plan.actions.card_label}
                    </div>
                  )}

                  <Card
                    className={cn(
                      "overflow-visible rounded-[28px] border-0 shadow-[0_28px_80px_rgba(15,23,42,0.08)]",
                      isFree && "bg-white",
                      isPro &&
                        "bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 text-white",
                      isPremium && "bg-premium-color"
                    )}
                  >
                    <CardBody className="p-6 sm:p-8">
                      {plan.actions?.upper_text && (
                        <div
                          className={cn(
                            "w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                            isFree && "bg-slate-100 text-slate-700",
                            (isPro || isPremium) && "bg-amber-300 text-slate-900"
                          )}
                        >
                          {plan.actions.upper_text}
                        </div>
                      )}

                      <div className="pt-5">
                        <h2 className="text-2xl font-semibold sm:text-3xl">
                          {plan.name}
                        </h2>
                        <div className="mt-3 flex items-end gap-2">
                          <h3 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                            ${plan.billing[cycleType]?.price}
                          </h3>
                          <span
                            className={cn(
                              "pb-2 text-sm font-medium",
                              isFree
                                ? "text-slate-500"
                                : "text-white/80"
                            )}
                          >
                            /{cycleType === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "mt-3 text-sm font-light subpixel-antialiased",
                            isFree ? "text-slate-600" : "text-white/80"
                          )}
                        >
                          {plan.actions?.text1}
                        </p>
                      </div>

                      <Button
                        disableRipple
                        onPress={() =>
                          handlePlanButton(
                            plan.code,
                            cycleType,
                            planCapabilities ?? [],
                            session,
                            router
                          )
                        }
                        className={cn(
                          "my-8 h-14 text-base font-semibold sm:text-lg",
                          isFree && "bg-slate-900 text-white",
                          isPro && "bg-white text-indigo-700",
                          isPremium && "bg-white text-slate-900"
                        )}
                      >
                        {plan.actions?.btn}
                      </Button>

                      <div
                        className={cn(
                          "rounded-[24px] border p-5",
                          isFree && "border-slate-200 bg-slate-50/80",
                          isPro && "border-white/20 bg-white/10",
                          isPremium && "border-white/10 bg-white/5"
                        )}
                      >
                        <ul className="space-y-3">
                          {getLimitRows(plan).map((item) => (
                            <li
                              key={item.label}
                              className={cn(
                                "flex items-center gap-3 text-sm",
                                isFree ? "text-slate-700" : "text-white"
                              )}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                                <Image
                                  alt={item.alt}
                                  src={item.src}
                                  width={item.width}
                                  height={item.height}
                                />
                              </div>
                              <span>{item.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Divider
                        className={cn(
                          "my-6",
                          isFree ? "bg-slate-200" : "bg-white/15"
                        )}
                      />

                      <ul className="space-y-3">
                        {plan.features_text?.map((feature, index, row) => {
                          const icon = getFeatureIcon(
                            plan.code,
                            plan.code === "free" && index + 1 === row.length
                          );

                          return (
                            <li
                              key={`${plan.code}-${feature}-${index}`}
                              className={cn(
                                "flex items-center gap-3 text-sm font-light subpixel-antialiased",
                                isFree ? "text-slate-600" : "text-white/90"
                              )}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                                <Image
                                  alt={icon.alt}
                                  src={icon.src}
                                  width={12}
                                  height={8}
                                />
                              </div>
                              <span>{feature}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div id="compare-features-table" className="bg-[#fbf7ff] pb-20">
        <CompareFeaturesTable data={data} />
      </div>
    </RootLayout>
  );
}

export default function Pricing() {
  return (
    <Suspense fallback={null}>
      <PricingComponent />
    </Suspense>
  );
}
