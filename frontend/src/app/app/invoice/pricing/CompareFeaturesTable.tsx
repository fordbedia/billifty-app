"use client";

import type { ReactNode } from "react";
import type { Plan } from "@/app/app/invoice/pricing/page";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CheckIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/10 text-xs font-semibold text-indigo-700">
      ✓
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
      ✕
    </span>
  );
}

type RowDef = {
  label: string;
  getValue: (plan: Plan | undefined) => ReactNode;
};

const rows: RowDef[] = [
  {
    label: "Business Profiles",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.limits?.business_profiles;
      return value ?? "Unlimited";
    },
  },
  {
    label: "Clients",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.limits?.clients;
      return value ?? "Unlimited";
    },
  },
  {
    label: "Invoices per month",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.limits?.invoices_per_month;
      return value ?? "Unlimited";
    },
  },
  {
    label: "PDF Watermark",
    getValue: (plan) => {
      if (!plan) return "–";
      const hasWatermark = plan.features?.pdf_watermark;

      if (hasWatermark) {
        return (
          <span className="inline-flex rounded-full bg-amber-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
            Yes
          </span>
        );
      }

      return <CheckIcon />;
    },
  },
  {
    label: "Email Branding",
    getValue: (plan) => {
      if (!plan) return "–";
      const branding = plan.features?.email_branding;

      if (branding === "billifty_footer") return "Billifty footer";
      if (branding === "small_footer") return "Small footer";
      if (branding === "none") return <CheckIcon />;

      return "–";
    },
  },
  {
    label: "Templates",
    getValue: (plan) => {
      if (!plan) return "–";
      const templates = plan.features?.templates;

      if (templates === "basic") return "Basic";
      if (templates === "multiple") return "Multiple";
      if (templates === "all_advanced") return "All Advanced";

      return "–";
    },
  },
  {
    label: "Custom Brand Colors",
    getValue: (plan) => {
      if (!plan) return "–";
      return plan.features?.custom_branding ? <CheckIcon /> : <CrossIcon />;
    },
  },
  {
    label: "Logo Upload",
    getValue: (plan) => {
      if (!plan) return "–";
      return plan.features?.logo_upload ? <CheckIcon /> : <CrossIcon />;
    },
  },
  {
    label: "Automated Reminders",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.features?.automated_reminders;

      if (value === "none") return <CrossIcon />;
      if (value === "manual") return "Manual";
      if (value === "automatic") return <CheckIcon />;

      return "–";
    },
  },
  {
    label: "Online Payments",
    getValue: (plan) => {
      if (!plan) return "–";
      return plan.features?.online_payments ? <CheckIcon /> : <CrossIcon />;
    },
  },
  {
    label: "Multi-Currency",
    getValue: (plan) => {
      if (!plan) return "–";
      return plan.features?.multi_currency ? <CheckIcon /> : <CrossIcon />;
    },
  },
  {
    label: "Analytics",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.features?.analytics;
      if (!value) return "–";

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    label: "AI Invoice Assistant",
    getValue: (plan) => {
      if (!plan) return "–";
      return plan.features?.ai_invoice_assistant ? <CheckIcon /> : <CrossIcon />;
    },
  },
  {
    label: "Support",
    getValue: (plan) => {
      if (!plan) return "–";
      const value = plan.features?.support;

      if (value === "priority") return "Priority";
      if (value === "email") return "Email";
      return "–";
    },
  },
];

type CompareFeaturesTableProps = {
  data?: Plan[];
};

const headerCardClasses = [
  "border border-slate-200 bg-white text-slate-900",
  "border border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200/80",
  "border border-slate-700 bg-slate-800 text-white",
];

export default function CompareFeaturesTable({
  data,
}: CompareFeaturesTableProps) {
  const orderedPlans: (Plan | undefined)[] = [
    data?.find((plan) => plan.code === "free"),
    data?.find((plan) => plan.code === "pro"),
    data?.find((plan) => plan.code === "premium"),
  ];

  return (
    <section className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Compare all features
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            See what&apos;s included with each plan.
          </p>
        </div>

        <div className="mt-8 rounded-[32px] border border-white/90 bg-white/85 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:mt-12 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-separate border-spacing-0 text-sm text-slate-700">
              <thead>
                <tr>
                  <th className="w-[28%] px-3 pb-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:px-4">
                    Feature
                  </th>
                  {orderedPlans.map((plan, index) => (
                    <th key={plan?.code ?? index} className="w-[24%] px-2 pb-4 sm:px-3">
                      <div
                        className={cn(
                          "rounded-[24px] px-4 py-4 text-center",
                          headerCardClasses[index]
                        )}
                      >
                        {index === 1 && (
                          <span className="mb-3 inline-flex rounded-full bg-amber-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                            Best for freelancers
                          </span>
                        )}
                        <div className="text-lg font-semibold">
                          {plan?.name ?? "—"}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.label}>
                    <td
                      className={cn(
                        "border-b border-slate-200 px-3 py-4 text-left align-middle font-medium text-slate-600 sm:px-4",
                        rowIndex === rows.length - 1 && "border-b-0"
                      )}
                    >
                      {row.label}
                    </td>
                    {orderedPlans.map((plan, planIndex) => (
                      <td
                        key={plan?.code ?? `${row.label}-${planIndex}`}
                        className={cn(
                          "border-b border-slate-200 px-3 py-4 text-center align-middle sm:px-4",
                          rowIndex === rows.length - 1 && "border-b-0",
                          planIndex === 1 && "bg-indigo-50/70",
                          planIndex === 2 && "bg-slate-50/80"
                        )}
                      >
                        {row.getValue(plan)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-500 sm:hidden">
            Swipe horizontally to see all plans.
          </p>
        </div>
      </div>
    </section>
  );
}
