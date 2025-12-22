"use client"

import RootLayout from "@/app/components/common/RootLayout"
import Image from "next/image"
import { Button, Card, CardBody } from "@heroui/react"
import {Suspense, useEffect, useMemo, useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { uri } from "@/app/constants/routePaths"
import Billing from "@/app/models/Billing";

type SuccessCheckout = {
  subscription?: {
    plan_code?: string
    billing_cycle?: string
    unit_amount?: number
  }
}

function Inner() {
  const router = useRouter()
  const [session, setSession] = useState<SuccessCheckout | null>(null)
  const [ready, setReady] = useState(false)
  const sp = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("success_checkout")
      const parsed = raw ? (JSON.parse(raw) as SuccessCheckout) : null

      setSession(parsed)
    } catch {
      setSession(null)
    } finally {
      setReady(true)
    }
  }, [])

  // Redirect once we know we’re in the browser & session is missing/invalid
  useEffect(() => {
    if (!ready) return
    if (!session?.subscription) {
      // router.replace(uri.h)
    }
  }, [ready, session, router])

  useEffect(() => {
    const run = async () => {
      const sessionId = sp.get("session_id");
      if (!sessionId) {
        setError("Missing session_id from Stripe redirect.");
        return;
      }

      try {
        //@TODO: FIXED Redirection issue
        const c = await Billing.confirmCheckout({session_id: sessionId});
        window.sessionStorage.setItem("success_checkout", JSON.stringify(c.user));
        window.location.reload();
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Unable to confirm subscription.");
      }
    };

    run();
  }, [sp, router]);

  const {planLabel, cycle, dollars} = useMemo(() => {
    const planCode = session?.subscription?.plan_code ?? ""
    const billingCycle = session?.subscription?.billing_cycle ?? ""
    const cents = session?.subscription?.unit_amount ?? 0

    const planLabel = planCode
        ? planCode.charAt(0).toUpperCase() + planCode.slice(1).toLowerCase()
        : ""

    const cycle = billingCycle
        ? billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1).toLowerCase()
        : ""

    const dollars = cents / 100

    return {planLabel, cycle, dollars}
  }, [session])

  // While loading session on the client, show nothing (or a loader)
  if (!ready) return null

  // If redirecting, render nothing
  if (!session?.subscription) return null

  return (
      <>
        <div className="flex justify-center flex-col items-center gap-4 mx-8 md:mx-0">
          <div className="md:max-w-4xl text-center justify-items-center">
            <Image src="/images/check-icon-success.png" alt="Check Success Icon" width={216} height={216}/>
            <h2 className="text-6xl font-bold subpixel-antialiased">Congratulations! 🎉</h2>
            <h3 className="pt-4 text-2xl font-extralight subpixel-antialiased">
              You&#39;ve successfully subscribed to the{" "}
              <strong className="font-semibold text-indigo-600">{planLabel} Plan</strong>
            </h3>

            <p className="pt-4 text-lg subpixel-antialiased font-extralight">
              Welcome to Billifty Pro! Your account has been upgraded and you now have access to all premium features.
              Start creating professional invoices right away.
            </p>

            <Card className="max-w-screen-2xl mt-6 mb-7">
              <CardBody>
                <div className="flex flex-row flex-wrap justify-center items-center md:gap-30 gap-12 py-7 px-12">
                  <div className="text-center justify-items-center">
                    <Image src="/images/checkout/premium-plan-icon.png" alt="Plan Icon" width={64} height={64}/>
                    <h2 className="text-base font-bold subpixel-antialiased pt-2">Plan Type</h2>
                    <h3 className="text-base font-extralight subpixel-antialiased">{planLabel} Plan</h3>
                  </div>

                  <div className="text-center justify-items-center">
                    <Image src="/images/checkout/billing-monthly-icon.png" alt="Billing Icon" width={64} height={64}/>
                    <h2 className="text-base font-bold subpixel-antialiased pt-2">Billing Cycle</h2>
                    <h3 className="text-base font-extralight subpixel-antialiased">{cycle}</h3>
                  </div>

                  <div className="text-center justify-items-center">
                    <Image src="/images/checkout/dollar-icon.png" alt="Dollar Icon" width={64} height={64}/>
                    <h2 className="text-base font-bold subpixel-antialiased pt-2">Amount Paid</h2>
                    <h3 className="text-base font-extralight subpixel-antialiased">
                      ${dollars}/{cycle}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="mb-10">
              <Button
                  className="text-md bg-indigo-600 text-white px-12 py-7 rounded-lg"
                  disableRipple
                  onPress={() => router.push(uri.invoices)} // change to your dashboard route if you have one
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                </svg>
                View Invoice Dashboard
              </Button>
            </div>

            <Card className="max-w-screen-2xl mt-6 mb-7 bg-blue-100 mx-8 md:mx-0">
              <CardBody>
                <h2 className="text-xl font-bold text-center pt-7">What&#39;s Next?</h2>
                <div className="flex md:flex-row flex-col justify-center items-baseline md:gap-20 gap-7 py-7 px-12">
                  <div className="flex flex-row">
                    <div>
                      <div className="bg-blue-800 text-white px-4 py-2 mx-4 rounded-lg text-lg">1</div>
                    </div>
                    <div>
                      <h2>Set Up Profile</h2>
                      <p>Complete your business profile to start creating invoices</p>
                    </div>
                  </div>

                  <div className="flex flex-row">
                    <div>
                      <div className="bg-blue-800 text-white px-4 py-2 mx-4 rounded-lg text-lg">2</div>
                    </div>
                    <div>
                      <h2>Add Clients</h2>
                      <p>Import or add your clients to manage invoices easily</p>
                    </div>
                  </div>

                  <div className="flex flex-row">
                    <div>
                      <div className="bg-blue-800 text-white px-4 py-2 mx-4 rounded-lg text-lg">3</div>
                    </div>
                    <div>
                      <h2>Create Invoice</h2>
                      <p>Design and send your first professional invoice</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </>
  )
}

  export default function CheckoutSuccessPage() {
  return (
    <RootLayout>
      <Suspense>
        <Inner />
      </Suspense>
    </RootLayout>
  );
}