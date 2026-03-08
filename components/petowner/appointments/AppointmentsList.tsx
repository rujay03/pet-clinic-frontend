"use client";

import type { Appointment } from "@/types/appointment";
import AppointmentCard from "./AppointmentCard";

interface AppointmentsListProps {
  title: string;
  appointments: Appointment[];
  variant: "upcoming" | "past" | "cancelled";
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onReschedule?: (id: number) => void;
  onCancel?: (id: number) => void;
}

export default function AppointmentsList({
  title,
  appointments,
  variant,
  page,
  pageSize,
  onPageChange,
  onReschedule,
  onCancel,
}: AppointmentsListProps) {
  const totalPages = Math.max(1, Math.ceil(appointments.length / pageSize));
  const paginated = appointments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <span className="text-sm text-blue-600 font-medium">
          {appointments.length} Appointment{appointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      {paginated.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400">
          No {variant} appointments found.
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              variant={variant}
              onReschedule={onReschedule}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                p === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

