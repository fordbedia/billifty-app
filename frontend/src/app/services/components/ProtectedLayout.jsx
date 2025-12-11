"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/app/helpers/auth";
import {uri} from "@/app/constants/routePaths";
import BSpinner from "@/app/components/Spinner";
import {useApp} from "@/app/providers/AppContext";
import {isProtectedPath} from "@/app/config/protectedRoutes";

export default function ProtectedLayout({ children, isProtected = false }) {
	const {
		userData,
		isUserDataLoading
	} = useApp()
  const router = useRouter();
	const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = auth();
    const protectedRoute = isProtectedPath(pathname);

    // 0. If route is NOT protected:
    //    Always allow rendering, no auth/plan checks.
    if (!protectedRoute) {
      setAllowed(true);
      return;
    }

    // 1. Route IS protected → require auth
    if (!session) {
      router.replace(uri.auth);
      return;
    }

    // 2. Protected route, but we're *on* the pricing page:
		// ----------------------------------------------------------------------------
		// NO PLANS YET! BUT ALLOWS THESE ROUTES:
		// Always allow pricing for logged-in users (even if no plan yet).
		// - pricing
		// - checkout
		// ----------------------------------------------------------------------------
    if (pathname === uri.pricing || pathname === uri.checkout) {
      setAllowed(true);
      return;
    }

    // 3. For other protected routes, we need userData to check plan/capabilities.
    if (isUserDataLoading) {
      // Still loading: keep spinner
      return;
    }

    const planCapabilities = userData?.plan_capabilities;
    const hasPlan = !!userData?.plan_id;

    const hasCapabilities =
      planCapabilities &&
      typeof planCapabilities === "object" &&
      Object.keys(planCapabilities).length > 0;

    // 4. Logged in, protected route, but no plan or no capabilities → go to pricing
    if (!hasPlan || !hasCapabilities) {
      if (pathname !== uri.pricing) {
        router.replace(uri.pricing);
      }
      return;
    }

    // 5. All checks passed
    setAllowed(true);
  }, [router, pathname, userData, isUserDataLoading]);

  if (!allowed) {
    // Simple loading state while we check auth
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <BSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
