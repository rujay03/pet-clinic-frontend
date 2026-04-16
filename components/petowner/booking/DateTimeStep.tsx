"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@/styles/daypicker.css";
import { apiFetch } from "@/lib/api";
import type { DoctorSummary } from "@/types/doctor";

interface DateTimeStepProps {
  data: {
    selectedDate: Date | null;
    selectedTime: string;
    petName: string;
    note: string;
    doctorId?: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
  submitting?: boolean;
}

type AvailableSlot = { slotStart: string; slotEnd: string };

export default function DateTimeStep({
  data,
  onNext,
  onBack,
  submitting = false,
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.selectedDate || undefined,
  );
  const [selectedTime, setSelectedTime] = useState(data.selectedTime || "");
  const [doctorId, setDoctorId] = useState<string>(data.doctorId || "");
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Load doctors list once
  useEffect(() => {
    apiFetch<DoctorSummary[]>("/api/doctors")
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  // Fetch slots when doctor/date change
  useEffect(() => {
    if (!doctorId || !selectedDate) {
      setSlots([]);
      return;
    }
    const dateStr = selectedDate.toISOString().split("T")[0];
    setLoadingSlots(true);
    setSlotsError(null);
    apiFetch<AvailableSlot[]>(`/api/doctors/${doctorId}/available-slots?date=${dateStr}`)
      .then((res) => {
        setSlots(res);
        // If the previously selected time is no longer valid, clear it
        if (!res.some((s) => s.slotStart === selectedTime)) {
          setSelectedTime("");
        }
      })
      .catch(() => setSlotsError("Failed to load available slots"))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, selectedDate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && doctorId) {
      onNext({ selectedDate, selectedTime, doctorId });
    }
  };

  const formattedSlots = useMemo(
    () =>
      slots.map((s) => ({
        ...s,
        label: formatSlotLabel(s.slotStart, s.slotEnd),
      })),
    [slots],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-[1fr_340px] gap-8">
        {/* Left: Calendar and Time */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Schedule Date & Time
          </h2>

          {/* Doctor selector */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Doctor
            </label>
            <select
              value={doctorId}
              onChange={(e) => {
                setDoctorId(e.target.value);
                setSelectedTime("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm w-fit">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || undefined);
                setSelectedTime("");
              }}
              showOutsideDays
            />
          </div>

          {/* Slot list */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Available Slots
              </label>
              {loadingSlots && (
                <span className="text-xs text-slate-500">Loading…</span>
              )}
            </div>
            {slotsError && (
              <div className="mb-2 rounded bg-red-50 px-3 py-2 text-xs text-red-600">
                {slotsError}
              </div>
            )}
            {!doctorId || !selectedDate ? (
              <p className="text-sm text-slate-500">
                Select doctor and date to view slots.
              </p>
            ) : formattedSlots.length === 0 ? (
              <p className="text-sm text-slate-500">No slots available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formattedSlots.map((slot) => (
                  <button
                    key={slot.slotStart}
                    type="button"
                    onClick={() => setSelectedTime(slot.slotStart)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTime === slot.slotStart
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-300 bg-white text-slate-800 hover:border-blue-400"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Pet Summary */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex flex-col items-center text-center">
            {/* Pet Image Placeholder */}
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-300">
              <img
                src="/api/placeholder/96/96"
                alt={data.petName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Pet Name */}
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              {data.petName || "Select a pet"}
            </h3>

            {/* Pet Details */}
            {data.petName && (
              <div className="mb-4 flex gap-2">
                <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                  Golden Retriever
                </span>
                <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                  Female, 2 y.o
                </span>
              </div>
            )}

            {/* Note */}
            {data.note && <p className="text-sm text-gray-600">{data.note}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting || !doctorId || !selectedDate || !selectedTime}
          className="rounded-lg bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5558E3] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Booking…" : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

function formatSlotLabel(start: string, end: string) {
  return `${toDisplayTime(start)} – ${toDisplayTime(end)}`;
}

function toDisplayTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}
