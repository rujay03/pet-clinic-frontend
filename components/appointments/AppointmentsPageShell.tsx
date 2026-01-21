"use client";

import { useState } from "react";
import PetSelector from "./PetSelector";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentSummaryCard from "./AppointmentSummaryCard";
import AppointmentHistoryTable from "./AppointmentHistoryTable";

export default function AppointmentsPageShell() {
  // 📌 later this will come from backend (list of pets)
  const pets = [{ id: "roxy", name: "Roxy" }];

  const [selectedPetId, setSelectedPetId] = useState("roxy");

  // 📌 initial selected date (matches the mock: July 2, 2024)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2024, 6, 2), // month is 0-based → 6 = July
  );

  // 📌 dummy history data – later replace with API response
  const historyItems = [
    {
      date: "2023-01-15",
      petName: "Roxy",
      note: "Annual Checkup",
      type: "Vaccinations",
    },
    {
      date: "2023-05-20",
      petName: "Roxy",
      note: "Skin Condition",
      type: "Medication",
    },
    {
      date: "2023-09-10",
      petName: "Roxy",
      note: "Limping",
      type: "Rest and Pain Relief",
    },
  ];

  return (
    <main className="mx-auto flex max-w-6xl flex-col px-6 py-6">
      {/* Top bar: title + pet selector + new appointment button */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Appointments</h1>

        <PetSelector
          selectedPetId={selectedPetId}
          pets={pets}
          onChange={setSelectedPetId}
          onNewAppointment={() => {
            // 👉 later: open modal / navigate to new appointment form
            console.log("New appointment clicked for pet:", selectedPetId);
          }}
        />
      </div>

      {/* Middle section: calendar (left) + appointment summary (right) */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <AppointmentsCalendar
          selectedDate={selectedDate ?? new Date()}
          onSelectDate={(date) => {
            if (!date) return;
            setSelectedDate(date);
          }}
        />

        <AppointmentSummaryCard
          petName="Roxy"
          breed="Golden Retriever"
          ageLabel="Female, 2 y.o"
          note="Swollen leg for about 3 days"
        />
      </div>

      {/* Bottom section: history table */}
      <AppointmentHistoryTable items={historyItems} />
    </main>
  );
}
