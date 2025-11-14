// frontend/src/app/utils/computeInvoice.js
const toInt = (v) => (Number.isFinite(+v) ? Math.trunc(+v) : 0);
const toFloat = (v) => (Number.isFinite(+v) ? +v : 0);

/**
 * Mirrors backend Invoicing/Services/InvoiceCalculator.php
 * Do NOT change the math/fields unless you also update the backend.
 */
export function computeInvoice(prev) {
  const next = { ...prev };
  const mode = prev.discount_mode ?? "none";
  const usePerLine = mode === "per-line";

  let subtotalBase = 0; // sum of line bases (qty*unit) AFTER per-line discounts
  let taxSum = 0;       // sum of per-item taxes

  const items = (prev.invoice_items || []).map((it, i) => {
    const qty     = toFloat(it.quantity ?? 0);
    const unit    = toInt(it.unit_price_cents ?? 0);
    const taxRate = toFloat(it.tax_rate ?? 0); // percent, e.g. 8.25

    let base = Math.round(qty * unit);

    // Only apply per-line discounts in 'per-line' mode
    if (usePerLine) {
      const rawCents = it.line_discount_cents;
      const rawRate  = it.line_discount_rate;
      const hasCents = rawCents != null && toInt(rawCents) > 0;
      const hasRate  = rawRate  != null && toFloat(rawRate) > 0;

      if (hasRate) {
        const pct = Math.min(100, Math.max(0, toFloat(rawRate)));
        base -= Math.round(base * (pct / 100));
      }
      // (If backend ever uses per-line fixed amount, it would go here using hasCents)
    }

    base = Math.max(0, base);

    const lineTax      = Math.round(base * (taxRate / 100));
    const lineWithTax  = base + lineTax;

    subtotalBase += base;
    taxSum       += lineTax;

    return {
      ...it,
      position: it.position ?? i + 1,
      tax_cents: lineTax,
      line_total_cents: lineWithTax,
    };
  });

  // Invoice-level discount (mutually exclusive with per-line)
  let invoiceLevelDiscount = 0;
  if (mode === "amount") {
    invoiceLevelDiscount = toInt(prev.discount_cents ?? 0);
  } else if (mode === "percent") {
    const rate = toFloat(prev.discount_rate ?? 0); // 10 => 10%
    invoiceLevelDiscount = Math.round(subtotalBase * (rate / 100));
  }
  invoiceLevelDiscount = Math.max(0, invoiceLevelDiscount);

  const shipping        = toInt(prev.shipping_cents ?? 0);
  const shippingTaxRate = toFloat(prev.shipping_tax_rate ?? 0);
  const shippingTax     = Math.round(shipping * (shippingTaxRate / 100));

  // For now, we trust per-item tax
  const tax = Math.max(0, taxSum);

  const total = Math.max(
    0,
    subtotalBase - invoiceLevelDiscount + tax + shipping + shippingTax
  );

  // 🔹 Mutate the "next" invoice just like backend expects
  next.invoice_items      = items;
  next.subtotal_cents     = subtotalBase;
  next.tax_cents          = tax;
  next.discount_cents     = invoiceLevelDiscount; // normalized applied discount
  next.shipping_tax_cents = shippingTax;
  next.total_cents        = total;

  // Display-only row used in UI
  next.display_discount_row =
    (mode === "amount" || mode === "percent") && invoiceLevelDiscount > 0
      ? { label: "Discount", amount_cents: -invoiceLevelDiscount }
      : null;

  // If amount_due_cents is used, sync it with total
  if (typeof next.amount_due_cents === "number") {
    next.amount_due_cents = total;
  }

  return next;
}

export const centsToDollarsStr = (c) => ((c ?? 0) / 100).toFixed(2);

export const dollarsToCents = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};
