"use client"

import React, {Suspense, useEffect, useRef, useState} from "react";
import RootLayout from "@/app/components/common/RootLayout";
import { useRouter, usePathname } from "next/navigation";
import {Button, Card, CardBody, Divider, Image, Tab, Tabs} from "@heroui/react";
import {useQuery} from "@tanstack/react-query";
import Plans from "@/app/models/Plans";
import CompareFeaturesTable from "@/app/app/invoice/pricing/CompareFeaturesTable";
import {useApp} from "@/app/providers/AppContext";
import { auth } from "@/app/helpers/auth";
import {router} from "next/client";
import {uri} from "@/app/constants/routePaths";
import {useSearchParams} from "next/navigation";
import {proceedToPlanCheckout} from "@/app/utils/pricing";

export type BillingCycle = "monthly" | "yearly"

export type BillingDetails = {
    price: number;
    // you can add more fields later (currency, discount, etc.)
};
export type Plan = {
    billing: Record<BillingCycle, BillingDetails>,
    actions: Record<string, any>,
    code: string;
    features: Record<string, any>;
    limits: Record<string, any>;
    name: string;
    monthly: number;
    yearly: number;
    features_text: string[];
};

export function PricingComponent() {
    const {
        userData,
        isErrorUserData,
    } = useApp()
    const session = auth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [cycleType, setCycleType] = useState<BillingCycle>("monthly")
    const planCapabilities = userData?.plan_capabilities ?? []

    const hasRun = useRef<boolean>(false)
    const isBillingCycle = (v: string | null): v is BillingCycle =>
        v === "monthly" || v === "yearly";

    useEffect(() => {
        if (hasRun.current) return

        const autoCheckout = searchParams.get("auto_checkout")
        const plan = searchParams.get("plan_code")
        const billingCycle = searchParams.get('billing_cycle')

        if (!isBillingCycle(billingCycle)) return;

        if (!autoCheckout || !plan) return

        hasRun.current = true

        proceedToPlanCheckout(
          plan,
          billingCycle,
          planCapabilities,
          session,
          router
        )
    }, [
      searchParams.get("auto_checkout"),
      searchParams.get('billing_cycle'),
      searchParams.get("plan_code"),
      cycleType,
      planCapabilities,
      session,
      router,
    ])

    const {data} = useQuery<Plan[]>({
        queryKey: ["plan"],
        queryFn: async () => (await Plans.allPlans())?.data,
        retry: false,
    })

    const moveToCompareSection = () => {
        const compareSection = document.getElementById('compare-features-table');
        const scrollY = compareSection?.getBoundingClientRect().top ?? 0;
        window.scrollTo({top: scrollY, behavior: 'smooth'});
    }

    return (
        <RootLayout>
            <div className="flex justify-center items-center gap-4 flex-col">
                <div className="max-w-xl text-center pt-10">
                    <h1 className="subpixel-antialiased font-semibold text-5xl py-3">Simple pricing for powerful invoices</h1>
                    <p className="subpixel-antialiased text-lg font-extralight py-3">Start free, then scale as your business grows.</p>
                    <p className="subpixel-antialiased text-lg font-extralight">Billifty is designed for freelancers and small business owners who need professional invoicing without the complexity.</p>

                    <div className="flex justify-center gap-4 mt-10">
                        <Button disableRipple className="btn-colored text-lg py-6 px-6">Get started free</Button>
                        <Button disableRipple onPress={moveToCompareSection} variant="bordered" className="text-lg py-6 px-6">View all features</Button>
                    </div>

                    <div className="pt-10 pb-10">
                        <Tabs onSelectionChange={(v) => setCycleType(v as BillingCycle)} aria-label="Tabs colors" radius="full">
                          <Tab key="monthly" title="Monthly" />
                          <Tab key="yearly" title="Yearly" />
                        </Tabs>
                    </div>
                </div>

                <div className="w-full flex justify-center items-center gap-4 flex-col lg:flex-row pb-12">
                  {data && data.length > 0 && data.map((p) => (

                    // WRAPPER DIV – controls the floating label
                    <div
                      key={p.code}
                      className="relative w-[400px] shrink-0"
                    >

                      {/* FLOATING LABEL MUST BE OUTSIDE <Card> */}
                      {p.actions?.card_label && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2
                            z-50 bg-blue-600 text-white rounded-md px-3 py-1 shadow text-xs">
                          {p.actions.card_label}
                        </div>
                      )}

                      {/* CARD */}
                      <Card
                        className={
                          'w-[400px] shrink-0 ' +
                          (p.code === 'pro'
                            ? 'border-blue-600 border-2'
                            : p.code === 'free'
                            ? 'border-gray-200 border-2'
                            : p.code === 'premium'
                            ? 'bg-premium-color'
                            : '')
                        }
                      >
                        <CardBody className={p.code === 'pro' ? 'py-14' : 'py-5'}>
                                <div className={'rounded-md text-sm w-fit px-1 py-1 ' + (p.code === 'free'
                                    ? 'bg-gray-200 text-black' : p.code === 'premium' ? 'bg-yellow-400 text-black' : '')}>{p.actions?.upper_text}</div>

                                <h2 className="py-1  pt-3 text-2xl font-semibold">{p.name}</h2>
                                <div className="flex flex-row items-baseline"><h2 className="py-1 text-6xl font-semibold pr-2">${p.billing[cycleType]?.price}</h2> /{cycleType === 'monthly' ? 'month' : 'year'}</div>
                                <h3 className="font-extralight subpixel-antialiased">{p.actions?.text1}</h3>

                               <Button
                                  onPress={() => proceedToPlanCheckout(p.code, cycleType, planCapabilities, session, router)}
                                  className={'my-8 py-6 font-semibold text-lg ' + (p.code === 'pro'
                                    ? 'bg-blue-600 text-white'
                                    : p.code === 'premium'
                                      ? 'text-black bg-white'
                                      : '')}
                                  disableRipple
                                >
                                  {p.actions?.btn}
                                </Button>


                                <ul className="free-plan-limits pb-6">
                                    <li className="flex items-center gap-3 py-1">
                                    {p.code === 'free'
                                        ? (
                                            <>
                                                <div className="w-6 flex justify-center">
                                                    <Image src="/images/price/free-bp.png" alt="free-business-profile" width="10" height="14" />
                                                </div>
                                                {p.limits?.business_profiles} Business Profile
                                            </>
                                        )
                                        : p.code === 'pro' ? (
                                            <>
                                                <div className="w-6 flex justify-center">
                                                    <Image src="/images/price/pro-bp.png" alt="free-business-profile" width="10" height="14" />
                                                </div>
                                                {p.limits?.business_profiles} Business Profiles
                                            </>
                                            )
                                            : (
                                                <>
                                                    <div className="w-6 flex justify-center">
                                                        <Image src="/images/price/premium-limits.png" alt="free-business-profile" width="18" height="9" />
                                                    </div>
                                                    {p.limits?.business_profiles} Business Profiles
                                                </>
                                            )}
                                    </li>
                                    <li className="flex items-center gap-3 py-1">
                                          {p.code === "free" ? (
                                            <>
                                                <div className="w-6 flex justify-center">
                                                  <Image alt="Free Client" src="/images/price/free-clients.png" width="17" height="14" />
                                                </div>
                                                  &nbsp;Up to {p.limits?.clients} Clients
                                            </>
                                          ) : p.code === "pro" ? (
                                            <>
                                                <div className="w-6 flex justify-center">
                                                  <Image alt="Pro Client" src="/images/price/pro-clients.png" width="17" height="14" />
                                                </div>
                                                  &nbsp;Unlimited Clients
                                            </>
                                          ) : (
                                            <>
                                                <div className="w-6 flex justify-center">
                                                  <Image alt="Premium Limits" src="/images/price/premium-limits.png" width="17" height="8" />
                                                </div>
                                                  &nbsp;Unlimited Clients
                                            </>
                                          )}
                                        </li>
                                        <li className="flex items-center gap-3 py-1">
                                            {p.code === "free" ? (
                                                <>
                                                    <div className="w-6 flex justify-center">
                                                      <Image alt="Free Invoice" src="/images/price/free-invoice.png" width="10" height="14" />
                                                    </div>
                                                    Up to {p.limits?.invoices_per_month} Invoices
                                                </>
                                            ) : p.code === "pro" ? (
                                                <>
                                                    <div className="w-6 flex justify-center">
                                                      <Image alt="Pro Invoice" src="/images/price/pro-invoice.png" width="10" height="14" />
                                                    </div>
                                                    Up to {p.limits?.invoices_per_month} invoices/month
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-6 flex justify-center">
                                                      <Image alt="Premium Limits" src="/images/price/premium-limits.png" width="17" height="8" />
                                                    </div>
                                                    Unlimited Invoices
                                                </>
                                            )}
                                        </li>

                                </ul>

                                <Divider />

                                <ul className="pt-4">
                                    {p.features_text && p.features_text.map((v: any, i: number, row) => (
                                        <li key={i} className="flex items-center gap-3 py-1 font-extralight subpixel-antialiased">
                                           <div className="w-6 flex justify-center">
                                               {p.code === 'free' && (i + 1 === row.length)
                                                   ? <Image alt="Info Icon" src="/images/price/info-icon.png" width="12" height="8" />
                                                   : p.code === 'free' && (i + 1 !== row.length)
                                                   ? <Image alt="Check Green Icon" src="/images/price/check-green.png" width="12" height="8" />
                                                   : p.code === 'pro' ? <Image alt="Check Pro Icon" src="/images/price/check-pro.png" width="12" height="8" />
                                                       : <Image alt="Check Premium Icon" src="/images/price/check-premium.png" width="12" height="8" />}
                                            </div>
                                            {v}
                                        </li>
                                    ))}
                                </ul>
                            </CardBody>
                        </Card>
                    </div>
                    ))}
                </div>

            </div>
            <div id="compare-features-table">
                <CompareFeaturesTable data={data} />
            </div>

        </RootLayout>
    )
}
export default function Pricing() {
    return (
        <Suspense fallback={null}><PricingComponent /></Suspense>
    )
}