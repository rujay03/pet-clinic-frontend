// components/pharmacy-staff/dashboard/DashboardSection.tsx
import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  actionText?: string;
  actionLink?: string;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  actionText,
  actionLink,
  children,
}: DashboardSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {actionText && (
          <button className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            {actionText}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
