"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@/styles/daypicker.css";

interface AppointmentsCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
}

export default function AppointmentsCalendar({
  selectedDate,
  onSelectDate,
}: AppointmentsCalendarProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Scheduled Appointments
      </h3>

      {/* Calendar + time side-by-side, shrink to content width */}
      <div className="flex w-fit items-start gap-6">
        {/* Calendar card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            showOutsideDays
          />
        </div>

        {/* Time input */}
        <div className="mt-4">
          <label
            htmlFor="time"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Time
          </label>
          <input
            id="time"
            type="time"
            defaultValue="16:00"
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
