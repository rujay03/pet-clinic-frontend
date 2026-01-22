// components/dashboard/DashboardShell.tsx

import KpiCard from "./KpiCard";
import SectionCard from "./SectionCard";
import TreatmentBarList from "./TreatmentBarList";

interface DashboardShellProps {
  userEmail?: string;
}

export default function DashboardShell({ userEmail }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        {/* Page header */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your clinic&apos;s performance and key metrics.
          </p>
        </header>

        {/* KPI row */}
        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Yearly Cost"
            value="$12,500"
            helper="Last 6 Months +12%"
          />
          <KpiCard label="Top Service" value="Vaccinations" helper="" />
          <KpiCard
            label="Appointment Trends"
            value="+15%"
            helper="This Month"
          />
        </section>

        {/* Middle row: Business Progress */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Cost over time */}
          <SectionCard title="Cost Over Time" subtitle="Last 6 Months">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-900">$12,500</p>
                <p className="text-xs text-emerald-600">+12%</p>
              </div>
            </div>
            {/* Simple line chart placeholder */}
            <div className="mt-2 h-40 rounded-lg bg-slate-50">
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Cost chart (static placeholder)
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </SectionCard>

          {/* Service popularity */}
          <SectionCard title="Service Popularity" subtitle="This Month">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-900">150</p>
                <p className="text-xs text-emerald-600">+8%</p>
              </div>
            </div>

            <div className="flex items-end gap-3">
              {["Vaccinations", "Check-ups", "Surgeries", "Dental Care"].map(
                (label, idx) => (
                  <div
                    key={label}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div className="flex h-24 w-8 items-end justify-center rounded-t bg-slate-100">
                      <div
                        className="w-6 rounded-t bg-slate-900"
                        style={{
                          height: `${60 + idx * 8}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{label}</span>
                  </div>
                )
              )}
            </div>
          </SectionCard>
        </section>

        {/* Treatment overview */}
        <SectionCard
          title="Treatment Overview"
          subtitle="Sales by Service – This Month"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Sales by Service
              </p>
              <p className="text-2xl font-semibold text-slate-900">$12,500</p>
              <p className="text-xs text-emerald-600">This Month +10%</p>
            </div>
          </div>

          <TreatmentBarList
            items={[
              { label: "Vaccinations", value: 90 },
              { label: "Check-ups", value: 75 },
              { label: "Surgeries", value: 60 },
              { label: "Dental Care", value: 65 },
              { label: "Grooming", value: 40 },
            ]}
          />
        </SectionCard>
      </main>
    </div>
  );
}
