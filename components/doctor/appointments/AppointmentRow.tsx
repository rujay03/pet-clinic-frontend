// components/doctor/appointments/AppointmentRow.tsx
"use client";

import type { Appointment } from "@/types/doctor";

interface AppointmentRowProps {
  appointment: Appointment;
  isLast?: boolean;
}

export default function AppointmentRow({
  appointment,
  isLast,
}: AppointmentRowProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700 border-green-200";
      case "Booked":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Completed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getActionButtons = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Pay Now
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Book Now
            </button>
          </>
        );
      case "Booked":
        return (
          <>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Pay Now
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Book Now
            </button>
          </>
        );
      case "Completed":
        return (
          <>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Pay Now
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Re-Book
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <tr
      className={`hover:bg-slate-50 ${!isLast ? "border-b border-slate-100" : ""}`}
    >
      <td className="px-8 py-4 text-sm text-slate-900">
        {appointment.firstName}
      </td>
      <td className="px-8 py-4 text-sm text-slate-900">
        {appointment.lastName}
      </td>
      <td className="px-8 py-4 text-sm text-slate-900">
        {appointment.phoneNumber}
      </td>
      <td className="px-8 py-4 text-sm text-slate-900">
        {appointment.petName}
      </td>
      <td className="px-8 py-4 text-sm text-slate-900">
        {appointment.appointmentDate} at {appointment.appointmentTime}
      </td>
      <td className="px-8 py-4">
        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles(appointment.status)}`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="px-8 py-4">
        <div className="flex items-center gap-2">
          {getActionButtons(appointment.status)}
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
