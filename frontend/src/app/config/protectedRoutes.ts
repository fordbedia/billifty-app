// frontend/src/app/config/protectedRoutes.ts
import { uri } from "@/app/constants/routePaths";

/**
 * Exact public routes (never protected)
 * Adjust based on your app.
 */
export const PUBLIC_ROUTES: string[] = [
  "/",               // home
  uri.intro,          // your intro page
  uri.auth,          // login/register
  uri.pricing,       // pricing page
];

export const UNSUBSCRIBE_ROUTES_TO_PRICING: string[] = [
  uri.invoices,
  uri.create_invoice,
  uri.business_profile.create,
  uri.business_profile.lists,
  uri.manage_subscriptions,
  uri.client.create_client,
  uri.client.clients
]

/**
 * Protected route prefixes.
 * Any route that starts with one of these will require:
 * - auth
 * - a valid plan (for plan-gated routes)
 */
export const PROTECTED_ROUTE_PREFIXES: string[] = [
  "/app",            // everything under /app is protected
  uri.checkout_success,
  // add more if needed: "/dashboard", "/account", ...
];

/**
 * Helper: is this path public?
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

/**
 * Helper: is this path protected?
 */
export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false;

  return PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

export function isUnsubscribeRouteToPricing(pathname: string, subscription: Record<string, any> | null): boolean {
  return (UNSUBSCRIBE_ROUTES_TO_PRICING.includes(pathname) && !subscription);
}
