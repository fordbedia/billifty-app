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
  description?: string | null;
  features: Record<string, any>;
  limits: Record<string, any>;
  name: string;
  monthly: number;
  yearly: number | null;
  features_text: string[];
};

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

function PricingComponent() {
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

  const orderedPlans = data ?? [];

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
      <section className="relative overflow-hidden bg-[#f8f9fb]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-96 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-64 h-80 w-80 rounded-full bg-slate-200/45 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[650px] text-center">
            <h1 className="subpixel-antialiased py-2 text-[38px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#111827] sm:text-[50px] lg:text-[56px]">
              Simple pricing for powerful
              <span className="block">invoices</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6 text-slate-500">
              Start free, then scale as your business grows.{" "}
              Billifty is designed for freelancers and small business owners who
              need professional invoicing without the complexity.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                className="min-w-[200px] rounded-md border-slate-300 bg-white/80 px-6 py-6 text-base font-semibold text-slate-700 shadow-sm backdrop-blur sm:text-lg"
              >
                View all features
              </Button>
            </div>

            <div className="mt-7 flex justify-center">
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/70">
                {(["monthly", "yearly"] as BillingCycle[]).map((billingCycle) => {
                  const isActive = billingCycle === cycleType;

                  return (
                    <button
                      key={billingCycle}
                      type="button"
                      onClick={() => setCycleType(billingCycle)}
                      className={cn(
                        "rounded-full px-5 py-2 text-xs font-semibold capitalize transition sm:px-6",
                        isActive
                          ? "bg-[#111827] text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {billingCycle}
                      {/*{billingCycle === "yearly" && (*/}
                      {/*  <span className={cn("ml-1", isActive ? "text-emerald-200" : "text-emerald-500")}>*/}
                      {/*    -20%*/}
                      {/*  </span>*/}
                      {/*)}*/}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
            {orderedPlans.map((plan) => {
              const isFree = plan.code === "free";
              const isPro = plan.code === "pro";
              const isPremium = plan.code === "premium";

              return (
                <div key={plan.code} className="relative">
                  {plan.actions?.card_label && (
                    <div className="absolute left-1/2 top-0 z-20 max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 shadow-lg shadow-amber-200/80">
                      {plan.actions.card_label}
                    </div>
                  )}

                  <Card
                    className={cn(
                      "h-full overflow-visible rounded-[28px] border shadow-[0_28px_80px_rgba(15,23,42,0.08)]",
                      isFree && "border-slate-200 bg-white",
                      isPro &&
                        "border-transparent bg-gradient-to-br from-[#5B4BFF] via-[#5547F5] to-[#6D5DF6] text-white shadow-[0_26px_70px_-42px_rgba(91,75,255,0.9)]",
                      isPremium && "border-[#111827] bg-[#111827] text-white"
                    )}
                  >
                    <CardBody className="flex h-full flex-col p-6 sm:p-8">
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
                        <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                          {plan.name}
                        </h2>
                        <div className="mt-3 flex items-end gap-1.5">
                          <h3 className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
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
                            "mt-3 min-h-12 text-sm font-light leading-6 subpixel-antialiased",
                            isFree ? "text-slate-500" : "text-white/75"
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
                          "my-8 h-14 w-full rounded-md text-base font-semibold sm:text-lg",
                          isFree && "bg-[#111827] text-white hover:bg-slate-800",
                          isPro && "bg-white text-[#5547F5] hover:bg-slate-50",
                          isPremium && "bg-white text-[#111827] hover:bg-slate-50"
                        )}
                      >
                        {plan.actions?.btn}
                      </Button>

                      <div
                        className={cn(
                          "rounded-[24px] border p-5",
                          isFree && "border-slate-100 bg-slate-50/80",
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
                              <div className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full " + (plan.code === 'premium' ? ' bg-[#050505]/85' : ' bg-white/85')}>
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
                                "flex items-center gap-3 text-sm font-light leading-5 subpixel-antialiased",
                                isFree ? "text-slate-600" : "text-white/90"
                              )}
                            >
                              <div className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full " + (plan.code === 'premium' ? " bg-[#050505]/80" : " bg-white/80")}>
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

      <div id="compare-features-table" className="bg-[#f8f9fb] pb-10">
        <CompareFeaturesTable data={data} />
      </div>

      <section className="bg-[#f8f9fb] px-4 pb-20">
        <div className="mx-auto max-w-[560px] rounded-xl bg-[#111827] px-6 py-10 text-center shadow-[0_24px_60px_-36px_rgba(17,24,39,0.85)] sm:px-10">
          <h2 className="text-2xl font-bold tracking-[-0.035em] text-white">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-sm leading-6 text-slate-400">
            Join freelancers and small businesses already using Billifty to create professional invoices.
          </p>
          <Button
            disableRipple
            onPress={() =>
              handlePlanButton(
                "free",
                cycleType,
                planCapabilities ?? [],
                session,
                router
              )
            }
            className="mt-6 h-11 rounded-md bg-[#5547F5] px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30"
          >
            Start for free today
          </Button>
        </div>
      </section>
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
