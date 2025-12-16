"use client";

import Model from "@/foundation/Model";

export default class Billing extends Model {
  static resource = 'billing';

  static async paymentMethods() {
    // GET /api/v1/billing/payment-methods
    const res = await this.axios().get(`/payment-methods`);
    return res.data; // { data: [...] }
  }

  static async removePaymentMethod(pmId) {
    // DELETE /api/v1/billing/payment-methods/{pm}
    const res = await this.axios().delete(`/payment-methods/${pmId}`);
    return res.data; // { ok: true }
  }

  static async createSubscription(payload) {
    // POST /api/v1/billing/create-subscription
    // payload: { plan_code, billing_cycle, payment_method_id, save_card }
    const res = await this.axios().post(`/create-subscription`, payload);
    return res.data; // { ok:true, subscription_id } OR { client_secret }
  }

	/**
   * Create subscription + PaymentIntent (for Payment Element)
   */
  static async createSubscriptionIntent(payload = {}) {
    // POST /api/v1/billing/subscription-intent
    const res = await this.axios().post("/subscription-intent", payload);
    return res.data;
  }

  /**
   * Create Stripe Billing Portal session
   */
  static async createPortalSession() {
    const res = await this.axios().post("/portal-session");
    return res.data;
  }

	static async confirmSubscription(payload) {
		const res = await this.axios().post("/confirm-subscription", payload);
		return res.data;
	}

	/**
   * Change plan (upgrade/downgrade)
   * POST /api/v1/billing/change-plan
   */
  static async changePlan(payload = {}) {
    const res = await this.axios().post("/subscription/change-plan", payload);
    return res.data;
  }

  /**
   * Cancel subscription
   * POST /api/v1/billing/cancel-subscription
   */
  static async cancelSubscription(payload = {}) {
    const res = await this.axios().post("/subscription/cancel", payload);
    return res.data;
  }

  /**
   * Create SetupIntent for Payment Element (setup mode)
   * POST /api/v1/billing/payment-method/setup-intent
   */
  static async createPaymentMethodSetupIntent(payload = {}) {
    const res = await this.axios().post("/payment-method/setup-intent", payload);
    return res.data;
  }

  /**
   * Save default payment method after SetupIntent succeeded
   * POST /api/v1/billing/payment-method/update
   */
  static async updatePaymentMethod(payload = {}) {
    const res = await this.axios().post("/payment-method/update", payload);
    return res.data;
  }

}
