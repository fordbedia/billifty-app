"use client";

import Model from "@/foundation/Model";

export default class Billing extends Model {
  static resource = "billing";

  static async createCheckoutSession(payload = {}) {
    // POST /api/v1/billing/checkout-session
    const res = await this.axios().post("/checkout-session", payload);
    return res.data;
  }

  static async createPortalSession(payload = {}) {
    // POST /api/v1/billing/portal-session
    const res = await this.axios().post("/portal-session", payload);
    return res.data;
  }

  static async createPaymentMethodSetupIntent(payload = {}) {
    const res = await this.axios().post("/payment-method/setup-intent", payload);
    return res.data;
  }

  static async updatePaymentMethod(payload = {}) {
    const res = await this.axios().post("/payment-method/update", payload);
    return res.data;
  }

	static async cancelSubscription(payload = {}) {
		const res = await this.axios().post("/cancel", payload);
		return res.data;
	}

	static async confirmCheckout(payload = {}) {
		const res = await this.axios().post("/confirm-checkout", payload);
		return res.data;
	}
}
