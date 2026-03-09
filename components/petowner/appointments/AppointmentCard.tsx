"use client";

import Image from "next/image";
import { getPetImageUrl } from "@/lib/api";
import type { Appointment } from "@/types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  variant: "upcoming" | "past" | "cancelled";
  onReschedule?: (id: number) => void;
  onCancel?: (id: number) => void;
}

/** Pick a default pet avatar based on species */
function getDefaultPetImage(species?: string) {
  if (species?.toLowerCase() === "cat") return "/cat-image.png";
  return "/dog.png";
}

/** Format date like "Thu, Apr 25, 2024" */
function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format time like "10:00 AM" */
function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export default function AppointmentCard({
  appointment,
  variant,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  // Prefer the stored pet image from backend; fall back to species-based default
  const resolvedPetImageUrl = getPetImageUrl(appointment.petImageUrl);
  const petImg = resolvedPetImageUrl || getDefaultPetImage(appointment.petSpecies);
  const doctorImg = appointment.doctorImageUrl || "/vet-expert.png";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm border-l-4 border-l-blue-500">
      {/* Pet avatar */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center">
        {petImg ? (
          <Image
            src={petImg}
            alt={appointment.petName}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-slate-500">
            {appointment.petName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>


      {/* Pet & Doctor info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{appointment.petName}</h3>
            {appointment.petBreed && (
              <p className="text-sm text-slate-500">{appointment.petBreed}</p>
            )}
          </div>
        </div>

        {/* Doctor row */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-200">
            <Image
              src={doctorImg}
              alt={appointment.doctorName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{appointment.doctorName}</p>
            <p className="text-xs text-slate-400">Veterinarian</p>
          </div>
        </div>
      </div>

      {/* Date / time */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-slate-900">
          {formatDate(appointment.appointmentDate)}{" "}
          <span className="font-normal text-slate-600">
            {formatTime(appointment.appointmentTime)}
          </span>
        </p>
        <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-slate-500">
          <svg className="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {formatDate(appointment.appointmentDate)}
          </span>
        </div>
        {variant === "upcoming" && formatTime(appointment.appointmentTime) && (
          <p className="text-xs text-slate-500 text-right">
            {formatTime(appointment.appointmentTime)}
          </p>
        )}
      </div>

      {/* Action buttons – only for upcoming */}
      {variant === "upcoming" && (
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onReschedule?.(appointment.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => onCancel?.(appointment.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Cancel
          </button>
        </div>
      )}

      {/* Status badge for past / cancelled */}
      {variant !== "upcoming" && (
        <div className="shrink-0">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              appointment.status === "Completed"
                ? "bg-emerald-50 text-emerald-700"
                : appointment.status === "Cancelled"
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {appointment.status}
          </span>
        </div>
      )}
    </div>
  );
}
