"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/app/helpers/auth";
import { uri } from "@/app/constants/routePaths";
import BSpinner from "@/app/components/Spinner";
import { useApp } from "@/app/providers/AppContext";
import { isProtectedPath, isUnsubscribeRouteToPricing } from "@/app/config/protectedRoutes";
import Forbidden from "@/app/app/invoice/components/errorPages/Forbidden";

export default function ProtectedLayout({ children, isProtected = false }) {
  const { userData, isUserDataLoading, planCapabilities } = useApp(); // use one source
  const subscription = userData?.subscription;
	const router = useRouter();
  const pathname = usePathname();

  const [allowed, setAllowed] = useState(false);
  const [forbiddenInfo, setForbiddenInfo] = useState(null);

  useEffect(() => {
    const session = auth();
    const protectedRoute = isProtectedPath(pathname);
		const unsubscribeToPricing = isUnsubscribeRouteToPricing(pathname);

		// 0) If user tries to access a specific route without a subscription
		if (unsubscribeToPricing) {
			setAllowed(false);
			setForbiddenInfo(null);
			router.push(uri.pricing);
			return;
		}

    // 0) Not protected
    if (!protectedRoute) {
      setAllowed(true);
      setForbiddenInfo(null);
      return;
    }

    // 1) Protected → require auth
    if (!session) {
      router.replace(uri.auth);
      return;
    }

    // 2) Always allow pricing/checkout
    if (pathname === uri.pricing || pathname === uri.checkout) {
      setAllowed(true);
      setForbiddenInfo(null);
      return;
    }

    // 3) Wait for userData
    if (isUserDataLoading) return;

    const hasPlan = !!userData?.plan_id;

    const hasCapabilities =
      planCapabilities &&
      typeof planCapabilities === "object" &&
      Object.keys(planCapabilities).length > 0;

    // 4) No plan/caps → pricing
    if (!hasPlan || !hasCapabilities) {
      if (pathname !== uri.pricing) router.replace(uri.pricing);
      return;
    }

    // 5) Now enforce route limits (we KNOW we have caps)
    const rule = LIMIT_RULES.find((r) => r.match(pathname));
    if (rule) {
      const res = checkLimit(planCapabilities, rule);
      if (res.blocked) {
        setAllowed(true);
        setForbiddenInfo({
          ...res,
          limitKey: rule.limitKey,
          currentKey: rule.currentKey,
        });
        return;
      }
    }

    setForbiddenInfo(null);
    setAllowed(true);
  }, [router, pathname, userData, isUserDataLoading, planCapabilities]);

  if (!allowed) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <BSpinner />
      </div>
    );
  }

  if (forbiddenInfo) {
    return (
      <Forbidden
        message="You have reached the limit for your current plan."
        details={forbiddenInfo}
      />
    );
  }

  return <>{children}</>;
}

const LIMIT_RULES = [
  {
    match: (pathname) => pathname === uri.create_invoice,
    limitKey: "max_invoices_per_month",
    currentKey: "current:invoices",
  },
  {
    match: (pathname) => pathname === uri.business_profile.create,
    limitKey: "max_business_profiles",
    currentKey: "current:businessProfiles",
  },
	{
    match: (pathname) => pathname === uri.client.create_client,
    limitKey: "max_clients",
    currentKey: "current:clients",
  },
];

function checkLimit(planCaps, rule) {
  const limits = planCaps?.allowed?.limits ?? planCaps?.limits;
  if (!limits) return { blocked: false };

  const current = limits?.[rule.currentKey];
  const max = limits?.[rule.limitKey];

  if (typeof current !== "number") return { blocked: false };
  if (max === null || max === undefined) return { blocked: false };
  if (typeof max !== "number") return { blocked: false };

  return {
    blocked: current >= max,
    current,
    max,
  };
}
