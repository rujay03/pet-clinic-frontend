"use client";

interface AppointmentsHeaderProps {
  onSchedule: () => void;
}

export default function AppointmentsHeader({ onSchedule }: AppointmentsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track your pet&apos;s clinic appointments
        </p>
      </div>
      <button
        type="button"
        onClick={onSchedule}
        className="inline-flex items-center gap-2 rounded-full bg-[#1e2a5a] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2a3870]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Schedule Appointment
      </button>
    </div>
  );
}

