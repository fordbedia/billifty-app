import Billing from "@/app/models/Billing";
import { uri } from "@/app/constants/routePaths";
import {useMutation} from "@tanstack/react-query";

export type BillingCycle = "monthly" | "yearly";
type PortalPayload = { return_url?: string };

export async function directionFlow(source: string) {
  return await Billing.getDirection({source})
}

export async function proceedToPlanCheckout(
  planCode: string,
  billingCycle: BillingCycle,
  planCapabilities: any,
  session: any,
  router: any
) {

  // If not logged in -> send to login/register, preserve intent
  if (!session) {
    router.push(`/auth?next=${encodeURIComponent(`${uri.pricing}?plan_code=${planCode}&billing_cycle=${billingCycle}`)}`);
    return;
  }

  const successUrl = window.location.origin + uri.checkout_success; // where you want them after payment
  const cancelUrl = window.location.origin + uri.manage_subscriptions;              // back to pricing if they cancel

  const res = await Billing.createCheckoutSession({
    plan_code: planCode,
    billing_cycle: billingCycle, // this is what you were missing
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  const url = res?.url;
  if (!url) throw new Error("Stripe Checkout session did not return a URL.");
  window.location.href = url;
}

export async function proceedToBillingPortal(payload: PortalPayload) {
  const res = await Billing.createPortalSession(payload);
  if (!res?.url) throw new Error("Stripe Checkout session did not return a URL.");
  window.location.href = res.url;
}