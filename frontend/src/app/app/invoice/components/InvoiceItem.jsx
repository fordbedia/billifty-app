import { Input } from "@heroui/react";
import {centsToDollarsStr, dollarsToCents} from "@/app/utils/computeInvoice";

// Helpers
export default function InvoiceItem({ item, index, onChange }) {
  const qty   = parseFloat(item.quantity ?? 0) || 0;
  const unit  = parseInt(item.unit_price_cents ?? 0, 10) || 0;
  const taxRt = parseFloat(item.tax_rate ?? 0) || 0;

  const baseLine = Math.round(qty * unit);
  const taxCents = Math.round(baseLine * (taxRt / 100));
  const lineWithTax = baseLine + taxCents;

  return (
    <div className="box-card px-4 py-4 my-3">
      <div className="flex flex-col md:flex-row gap-5">

        <div className="md:w-1/4">
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
          Unit Price ($)
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

        <div className="md:w-1/6">
          Amount ($)
          <Input
            isReadOnly
            variant="bordered"
            radius="sm"
            value={centsToDollarsStr(lineWithTax)}
          />
        </div>

        <div className="self-center">
          <i className="trash-icon"></i>
        </div>
      </div>
    </div>
  );
}
