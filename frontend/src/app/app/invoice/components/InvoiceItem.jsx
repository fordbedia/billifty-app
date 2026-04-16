import { Input, Link } from "@heroui/react";
import { Reorder, useDragControls } from "framer-motion";
import { centsToDollarsStr, dollarsToCents } from "@/app/utils/computeInvoice";
import { useInvoice } from "@/app/providers/InvoiceContext";

// Helpers
export default function InvoiceItem({
  item,
  index,
  onChange,
  removeItem,
}) {
  const { data, selectedCurrency, invoiceComputed } = useInvoice();
  const dragControls = useDragControls();
  const showPerLine = (data.discount_mode ?? "none") === "per-line";

  const qty   = parseFloat(item.quantity ?? 0) || 0;
  const unit  = parseInt(item.unit_price_cents ?? 0, 10) || 0;
  const taxRt = parseFloat(item.tax_rate ?? 0) || 0;

  const currencySymbol = selectedCurrency?.symbol ?? "";

  // Because computeInvoice (JS) mirrors backend, it returns `invoice_items`, not `items`
  const computedItem =
    invoiceComputed?.invoice_items?.[index] ?? item; // fallback to raw item if needed
  const lineTotalCents = computedItem.line_total_cents ?? 0;

  return (
    <Reorder.Item
      as="div"
      value={item}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.015,
        boxShadow: "0 24px 45px rgba(15, 23, 42, 0.16)",
        zIndex: 20,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="box-card px-4 py-4 my-3 invoice-item-card"
    >
      <div className="flex flex-col md:flex-row gap-5">
        <div className="invoice-item-drag-control">
          <button
            type="button"
            className="invoice-item-drag-handle"
            onPointerDown={(event) => dragControls.start(event)}
            aria-label={`Drag invoice item ${index + 1} to reorder`}
            title="Drag to reorder"
          >
            <span className="invoice-item-drag-dot"></span>
            <span className="invoice-item-drag-dot"></span>
            <span className="invoice-item-drag-dot"></span>
            <span className="invoice-item-drag-dot"></span>
            <span className="invoice-item-drag-dot"></span>
            <span className="invoice-item-drag-dot"></span>
          </button>
          <span className="invoice-item-position">{index + 1}</span>
        </div>

        <div className="invoice-item-fields">
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
            Unit Price ({currencySymbol})
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

          {/* Per-line discounts only shown when mode = per-line */}
          {showPerLine && (
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
          )}

          <div className="md:w-1/6">
            Amount ({currencySymbol})
            <Input
              isReadOnly
              variant="bordered"
              radius="sm"
              value={centsToDollarsStr(lineTotalCents)}
            />
          </div>

          <div className="self-center invoice-item-remove">
            <Link onPress={() => removeItem(index)} className="trash-link">
              <i className="trash-icon"></i>
            </Link>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}
