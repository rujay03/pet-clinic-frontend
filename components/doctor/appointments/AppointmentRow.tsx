// components/doctor/appointments/AppointmentRow.tsx
"use client";

import type { DoctorAppointment } from "@/types/doctor";

interface AppointmentRowProps {
  appointment: DoctorAppointment;
  isLast?: boolean;
  formattedDateTime: string;
  onStatusAction: (appointment: DoctorAppointment) => void;
  onEdit: (appointment: DoctorAppointment) => void;
  onDelete: (appointment: DoctorAppointment) => void;
  onView: (appointment: DoctorAppointment) => void;
  isUpdatingStatus: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isViewing: boolean;
}

export default function AppointmentRow({
  appointment,
  isLast,
  formattedDateTime,
  onStatusAction,
  onEdit,
  onDelete,
  onView,
  isUpdatingStatus,
  isEditing,
  isDeleting,
  isViewing,
}: AppointmentRowProps) {
  const getStatusStyles = (status: DoctorAppointment["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Completed":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Cancelled":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const canAdvanceStatus = appointment.status === "Upcoming";
  const canEdit = true;
  const canDelete = appointment.status !== "Completed";
  const statusActionLabel = "Mark Completed";

  return (
    <tr className={`hover:bg-[#F5F0FF] ${!isLast ? "border-b border-slate-200/70" : ""}`}>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.ownerName}</td>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.petName}</td>
      <td className="px-6 py-4 text-sm text-slate-800">{formattedDateTime}</td>
      <td className="px-6 py-4 text-sm text-slate-800">{appointment.appointmentType || "-"}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium ${getStatusStyles(appointment.status)}`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onStatusAction(appointment)}
            disabled={isUpdatingStatus || !canAdvanceStatus}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-200 disabled:text-indigo-800"
          >
            {isUpdatingStatus ? "Saving..." : statusActionLabel}
          </button>

          <button
            type="button"
            onClick={() => onEdit(appointment)}
            disabled={isEditing || !canEdit}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEditing ? "Saving..." : "Edit"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(appointment)}
            disabled={isDeleting || !canDelete}
            className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button
            type="button"
            onClick={() => onView(appointment)}
            disabled={isViewing}
            className="rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isViewing ? "Loading..." : "View"}
          </button>
        </div>
      </td>
    </tr>
  );
}
