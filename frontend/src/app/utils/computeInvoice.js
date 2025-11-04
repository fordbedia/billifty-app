const toInt = (v) => (Number.isFinite(+v) ? Math.trunc(+v) : 0);
const toFloat = (v) => (Number.isFinite(+v) ? +v : 0);

export function computeInvoice(prev) {
  const next = { ...prev };

  let subtotalBase = 0;   // sum of line bases (qty * unit)
  let taxSum = 0;         // sum of per-item taxes

  const items = (prev.invoice_items || []).map((it, i) => {
    const qty      = toFloat(it.quantity ?? 0);
    const unit     = toInt(it.unit_price_cents ?? 0);
    const taxRate  = toFloat(it.tax_rate ?? 0); // percent, e.g. 8.25

    // base line before tax/discount
    let base = Math.round(qty * unit);

    // optional per-line discount handling (keep if you use these fields)
    if (it.line_discount_cents != null) {
      base -= toInt(it.line_discount_cents);
    } else if (it.line_discount_rate != null) {
      const r = toFloat(it.line_discount_rate);
      base -= Math.round(base * r);
    }
    base = Math.max(0, base);

    // per-item tax (Pattern A + item tax)
    const lineTax = Math.round(base * (taxRate / 100));
    const lineWithTax = base + lineTax;

    subtotalBase += base;
    taxSum += lineTax;

    return {
      ...it,
      position: it.position ?? i + 1,
      tax_cents: lineTax,          // keep for display/debug if you want
      line_total_cents: lineWithTax, // amount shown in the row (incl. tax)
    };
  });

  const discount  = toInt(prev.discount_cents ?? 0);
  const shipping  = toInt(prev.shipping_cents ?? 0);
  const shippingTaxRate = toFloat(prev.shipping_tax_rate ?? 0);
  const shippingTax = Math.round(shipping * (shippingTaxRate / 100));

  // If you ALSO support invoice-level tax overrides, you could swap taxSum here.
  // For now we trust per-item tax:
  const tax = Math.max(0, taxSum);

  const total = Math.max(0, subtotalBase - discount + tax + shipping + shippingTax);

  next.shipping_tax_cents = shippingTax;
  next.invoice_items      = items;
  next.subtotal_cents     = subtotalBase;   // subtotal BEFORE tax
  next.tax_cents          = tax;            // total tax (sum of items)
  next.total_cents        = total;          // grand total

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