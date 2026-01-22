"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@/styles/daypicker.css";

interface DateTimeStepProps {
  data: {
    selectedDate: Date | null;
    selectedTime: string;
    petName: string;
    note: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function DateTimeStep({
  data,
  onNext,
  onBack,
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.selectedDate || undefined,
  );
  const [selectedTime, setSelectedTime] = useState(data.selectedTime || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onNext({ selectedDate, selectedTime });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-[1fr_340px] gap-8">
        {/* Left: Calendar and Time */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Schedule Date & Time
          </h2>

          {/* Calendar */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm w-fit">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              showOutsideDays
            />
          </div>

          {/* Time Input - Below Calendar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
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
          className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5558E3]"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
