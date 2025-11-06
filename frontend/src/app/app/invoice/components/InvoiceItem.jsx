import { Input, Link } from "@heroui/react";
import {centsToDollarsStr, dollarsToCents} from "@/app/utils/computeInvoice";
import {useInvoice} from "@/app/providers/InvoiceContext";

// Helpers
export default function InvoiceItem({ item, index, onChange, removeItem }) {
	const { data, selectedCurrency } = useInvoice();
  	const showPerLine = (data.discount_mode ?? 'none') === 'per-line';

  const qty   = parseFloat(item.quantity ?? 0) || 0;
  const unit  = parseInt(item.unit_price_cents ?? 0, 10) || 0;
  const taxRt = parseFloat(item.tax_rate ?? 0) || 0;

  const baseLine = Math.round(qty * unit);
  const taxCents = Math.round(baseLine * (taxRt / 100));
  const lineWithTax = baseLine + taxCents;

  return (
    <div className="box-card px-4 py-4 my-3">
      <div className="flex flex-col md:flex-row gap-5">

        <div className="md:w-1/3">
          Description
          <Input
            variant="bordered"
            radius="sm"
            value={item.description ?? ""}
            onValueChange={(v) => onChange(index, "description", v)}
          />
        </div>

        <div className="md:w-1/6">
          Qty
          <Input
            type="number"
            variant="bordered"
            radius="sm"
            value={String(qty)}
            onValueChange={(v) => {
              const nextQty = parseFloat(v) || 0;
              onChange(index, "quantity", nextQty);
            }}
          />
        </div>

        <div className="md:w-1/6">
          Unit Price ({selectedCurrency.symbol})
          <Input
            type="number"
            variant="bordered"
            radius="sm"
            value={centsToDollarsStr(unit)}
            onValueChange={(v) => {
              const cents = dollarsToCents(v);
              onChange(index, "unit_price_cents", cents);
            }}
          />
        </div>

        <div className="md:w-1/6">
          Tax Rate (%)
          <Input
            type="number"
            variant="bordered"
            radius="sm"
            value={String(taxRt)}
            onValueChange={(v) => {
              const next = parseFloat(v) || 0;
              onChange(index, "tax_rate", next);
            }}
          />
        </div>

		{/* 🔹 Per-line discounts only shown when mode = per-line */}
        {showPerLine && (
          <>
            <div className="md:w-1/6">
			Discount (%)
              <Input
                type="number"
                variant="bordered"
                radius="sm"
                value={String(item.line_discount_rate ?? 0)}
                onValueChange={(v) =>
                  onChange(index, "line_discount_rate", parseFloat(v) || 0)
                }
              />
            </div>
          </>
        )}

        <div className="md:w-1/6">
          Amount ({selectedCurrency.symbol})
          <Input
            isReadOnly
            variant="bordered"
            radius="sm"
            value={centsToDollarsStr(item.line_total_cents ?? 0)}
          />
        </div>

        <div className="self-center">
          <Link onPress={() => removeItem(index)}><i className="trash-icon"></i></Link>
        </div>
      </div>
    </div>
  );
}
