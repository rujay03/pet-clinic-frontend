// components/pharmacy-staff/dashboard/KpiCard.tsx
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  actionText: string;
  actionLink: string;
  borderColor: string;
  bgColor: string;
  iconBgColor: string;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  actionText,
  actionLink,
  borderColor,
  bgColor,
  iconBgColor,
}: KpiCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 ${borderColor} p-6 flex flex-col`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-900 mb-1">{title}</p>
      <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

      {/* Action Button */}
      <button
        className={`w-full py-2.5 ${bgColor} text-slate-700 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
      >
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
    </div>
  );
}
