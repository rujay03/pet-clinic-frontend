"use client";

export type TabType = "upcoming" | "past" | "cancelled";

interface AppointmentsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  upcomingCount: number;
}

export default function AppointmentsTabs({
  activeTab,
  onTabChange,
  upcomingCount,
}: AppointmentsTabsProps) {
  const tabs: { key: TabType; label: string; showBadge?: boolean }[] = [
    { key: "upcoming", label: "Upcoming", showBadge: true },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.showBadge && upcomingCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                    {upcomingCount}
                  </span>
                )}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}



