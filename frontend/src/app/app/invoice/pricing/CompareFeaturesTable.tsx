"use client";

import type { ReactNode } from "react";
import type { Plan } from "@/app/app/invoice/pricing/page";

function CheckIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-400">
      ✓
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-[11px] font-semibold text-rose-400">
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
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
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
      const branding = plan.features?.email_branding; // billifty_footer | small_footer | none

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
      const templates = plan.features?.templates; // basic | multiple | all_advanced

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
      const v = plan.features?.automated_reminders; // none | manual | automatic

      if (v === "none") return <CrossIcon />;
      if (v === "manual") return "Manual";
      if (v === "automatic") return <CheckIcon />;

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
      const v = plan.features?.analytics; // basic | standard | advanced
      if (!v) return "–";
      return v.charAt(0).toUpperCase() + v.slice(1); // Basic / Standard / Advanced
    },
  },
  {
    label: "Attachments per Invoice",
    getValue: (plan) => {
      if (!plan) return "–";
      const v = plan.features?.attachments; // 0 | 1 | 'unlimited'

      if (v === "unlimited") return "Unlimited";
      return String(v ?? "–");
    },
  },
  {
    label: "Support",
    getValue: (plan) => {
      if (!plan) return "–";
      const v = plan.features?.support; // email | priority
      if (v === "priority") return "Priority";
      if (v === "email") return "Email";
      return "–";
    },
  },
];

type CompareFeaturesTableProps = {
  data?: Plan[];
};

export default function CompareFeaturesTable({ data }: CompareFeaturesTableProps) {
  // Ensure consistent order: free → pro → premium
  const orderedPlans: (Plan | undefined)[] = [
    data?.find((p) => p.code === "free"),
    data?.find((p) => p.code === "pro"),
    data?.find((p) => p.code === "premium"),
  ];

  return (
    <section className="w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Compare all features
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            See what&apos;s included with each plan.
          </p>
        </div>

        {/* Table wrapper */}
        <div className="mt-8 sm:mt-12 overflow-x-auto">
          <div className="relative mx-auto inline-block min-w-full max-w-5xl align-middle">
            {/* Highlight background for Pro column */}
            <div className="pointer-events-none absolute inset-y-3 left-[65%] z-0 w-[22%] -translate-x-1/2 rounded-3xl bg-slate-100 dark:bg-slate-900/90 shadow-[0_0_40px_rgba(168,85,247,0.25)]" />

            {/* Bottom glow under Pro */}
            <div className="pointer-events-none absolute bottom-0 left-[65%] z-0 h-8 w-[26%] -translate-x-1/2 rounded-full bg-violet-400/30 dark:bg-violet-500/40 blur-2xl" />

            <table className="relative z-10 w-full border-separate border-spacing-0 text-[11px] sm:text-sm">
              <thead>
                <tr className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
                  {/* Feature column header */}
                  <th className="w-[32%] border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 pr-4 sm:pr-6 text-left">
                    Feature
                  </th>

                  {/* Free */}
                  <th className="w-[22%] border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 text-center">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {orderedPlans[0]?.name ?? "Free"}
                    </span>
                  </th>

                  {/* Pro with pill */}
                  <th className="w-[22%] border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <span className="rounded-full bg-violet-500/10 dark:bg-violet-500/20 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-200">
                        Best for freelancers
                      </span>
                      <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                        {orderedPlans[1]?.name ?? "Pro"}
                      </span>
                    </div>
                  </th>

                  {/* Premium */}
                  <th className="w-[22%] border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 text-center">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {orderedPlans[2]?.name ?? "Premium"}
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-200 dark:border-slate-900 last:border-0">
                    {/* Feature label */}
                    <td className="whitespace-nowrap border-b border-slate-200 dark:border-slate-900 py-2.5 sm:py-3 pr-4 sm:pr-6 text-left align-middle text-[11px] text-slate-600 dark:text-slate-300 sm:text-sm">
                      {row.label}
                    </td>

                    {orderedPlans.map((plan, idx) => (
                      <td
                        key={idx}
                        className={
                          "py-2.5 sm:py-3 text-center align-middle text-[11px] sm:text-sm " +
                          (idx === 1
                            ? "border-b border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-slate-50"
                            : "border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-200")
                        }
                      >
                        {row.getValue(plan)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Small hint for mobile users */}
            <p className="mt-3 text-[10px] text-center text-slate-500 dark:text-slate-500 sm:hidden">
              Swipe horizontally to see all plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
