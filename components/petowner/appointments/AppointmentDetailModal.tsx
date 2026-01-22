"use client";

import { ReactNode } from "react";

type Status = "Scheduled" | "In Progress" | "Completed";

export interface AppointmentDetail {
  id: string;
  time: string;
  title: string;
  petName: string;
  vetName: string;
  reason: string;
  notes: string;
  status: Status;
}

interface AppointmentDetailModalProps {
  appointment: AppointmentDetail | null;
  onClose: () => void;
}

export default function AppointmentDetailModal({
  appointment,
  onClose,
}: AppointmentDetailModalProps) {
  if (!appointment) return null;

  const statusColor =
    appointment.status === "In Progress"
      ? "bg-amber-100 text-amber-700"
      : appointment.status === "Completed"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-700";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {appointment.title}
            </h2>
            <p className="text-sm text-slate-500">
              {appointment.time} • {appointment.petName}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-600">Vet: </span>
            {appointment.vetName}
          </p>
          <p>
            <span className="font-medium text-slate-600">Reason: </span>
            {appointment.reason}
          </p>
          <p>
            <span className="font-medium text-slate-600">Notes: </span>
            {appointment.notes}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
