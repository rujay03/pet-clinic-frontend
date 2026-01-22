"use client";

import { useState } from "react";
import PetSelector from "./PetSelector";
import AppointmentsCalendar, {
  OngoingAppointmentBrief,
} from "./AppointmentsCalendar";
import AppointmentSummaryCard from "./AppointmentSummaryCard";
import AppointmentHistoryTable from "./AppointmentHistoryTable";
import AppointmentDetailModal, {
  AppointmentDetail,
} from "./AppointmentDetailModal";
import BookingModal from "../booking/BookingModal";

type OngoingAppointment = AppointmentDetail;

export default function AppointmentsPageShell() {
  const pets = [{ id: "roxy", name: "Roxy" }];
  const [selectedPetId, setSelectedPetId] = useState("roxy");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2024, 6, 2),
  );

  // Dummy ongoing appointments for the selected day
  const ongoingAppointments: OngoingAppointment[] = [
    {
      id: "1",
      time: "16:00",
      title: "Limping checkup",
      petName: "Roxy",
      vetName: "Dr. Silva",
      reason: "Limping on back leg",
      notes: "Owner reports limping for 3 days, worse after walks.",
      status: "In Progress",
    },
    {
      id: "2",
      time: "18:30",
      title: "Vaccination booster",
      petName: "Roxy",
      vetName: "Dr. Fernando",
      reason: "Annual vaccination booster",
      notes: "Check weight and update vaccination record.",
      status: "Scheduled",
    },
  ];

  const briefList: OngoingAppointmentBrief[] = ongoingAppointments.map((a) => ({
    id: a.id,
    time: a.time,
    title: a.title,
    status: a.status,
  }));

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDetail | null>(null);

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
    <>
      <main className="mx-auto flex max-w-6xl flex-col px-6 py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Appointments
          </h1>

          <PetSelector
            selectedPetId={selectedPetId}
            pets={pets}
            onChange={setSelectedPetId}
            onNewAppointment={() => {
              setIsBookingModalOpen(true);
            }}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] md:items-start">
          <AppointmentsCalendar
            selectedDate={selectedDate ?? new Date()}
            onSelectDate={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            ongoingAppointments={briefList}
            onSelectAppointment={(id) => {
              const appt = ongoingAppointments.find((a) => a.id === id) || null;
              setSelectedAppointment(appt);
            }}
          />

          <AppointmentSummaryCard
            petName="Roxy"
            breed="Golden Retriever"
            ageLabel="Female, 2 y.o"
            note="Swollen leg for about 3 days"
            ongoingAppointments={briefList}
            onSelectAppointment={(id) => {
              const appt = ongoingAppointments.find((a) => a.id === id) || null;
              setSelectedAppointment(appt);
            }}
          />
        </div>

        <AppointmentHistoryTable items={historyItems} />
      </main>

      {/* Detail modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Booking modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
