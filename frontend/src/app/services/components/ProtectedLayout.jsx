"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/helpers/auth";
import {uri} from "@/app/constants/routePaths";

export default function ProtectedLayout({ children, isProtected = false }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = auth(); // reads user + token from localStorage safely

    if (!session && isProtected) {
      // Not logged in → redirect to login page (adjust path if needed)
      router.replace(uri.auth);
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) {
    // Simple loading state while we check auth
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
