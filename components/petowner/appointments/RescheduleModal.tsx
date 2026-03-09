"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@/styles/daypicker.css";
import { apiFetch } from "@/lib/api";

interface RescheduleModalProps {
  appointmentId: number;
  petName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export default function RescheduleModal({
  appointmentId,
  petName,
  onClose,
  onSuccess,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setSubmitting(true);
    setError(null);

    try {
      const appointmentDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      const appointmentTime = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

      await apiFetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: "PATCH",
        body: { appointmentDate, appointmentTime },
      });

      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to reschedule. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#202458] px-6 py-4 text-white">
          <div>
            <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
            <p className="text-sm text-blue-200 mt-0.5">{petName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#202458] hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Calendar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select New Date
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm w-fit mx-auto">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                showOutsideDays
                disabled={{ before: new Date() }}
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select New Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          {/* Selected summary */}
          {selectedDate && selectedTime && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
              📅 {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              {" · "}
              {formatTime(selectedTime)}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedDate || !selectedTime}
              className="rounded-lg bg-[#6366F1] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#5558E3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

