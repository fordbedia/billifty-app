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

/**
 * Protected route prefixes.
 * Any route that starts with one of these will require:
 * - auth
 * - a valid plan (for plan-gated routes)
 */
export const PROTECTED_ROUTE_PREFIXES: string[] = [
  "/app",            // everything under /app is protected
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
