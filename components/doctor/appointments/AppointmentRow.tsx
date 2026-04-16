// components/doctor/appointments/AppointmentRow.tsx
"use client";

import type { DoctorAppointment } from "@/types/doctor";

interface AppointmentRowProps {
  appointment: DoctorAppointment;
  isLast?: boolean;
  onStatusAction: (appointment: DoctorAppointment) => void;
  isUpdating: boolean;
}

export default function AppointmentRow({
  appointment,
  isLast,
  onStatusAction,
  isUpdating,
}: AppointmentRowProps) {
  const getStatusStyles = (status: DoctorAppointment["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Waiting":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Consultation":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Completed":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getActionLabel = (status: DoctorAppointment["status"]) => {
    if (status === "Waiting") return "Start";
    if (status === "In Consultation") return "Continue";
    return "View";
  };

  const actionLabel = getActionLabel(appointment.status);
  const primaryActionEnabled =
    appointment.status === "Waiting" || appointment.status === "In Consultation";

  return (
    <tr className={`hover:bg-[#F5F0FF] ${!isLast ? "border-b border-slate-200/70" : ""}`}>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.ownerName}</td>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.phoneNumber}</td>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.petName}</td>
      <td className="px-6 py-4 text-sm text-slate-800">
        {appointment.appointmentDate} - {appointment.appointmentTime}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium ${getStatusStyles(appointment.status)}`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => primaryActionEnabled && onStatusAction(appointment)}
            disabled={isUpdating || !primaryActionEnabled}
            className={`min-w-28 rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              primaryActionEnabled
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-200 text-indigo-800"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {isUpdating ? "Saving..." : actionLabel}
          </button>

          <button
            type="button"
            className="rounded-md p-2 text-indigo-700 hover:bg-indigo-100"
            aria-label="View appointment"
            title="View appointment"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
