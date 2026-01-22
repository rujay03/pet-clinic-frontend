// components/doctor/appointments/AppointmentManagementTable.tsx
"use client";

import { useState } from "react";
import type { Appointment } from "@/types/doctor";
import AppointmentRow from "./AppointmentRow";
import Pagination from "./Pagination";

export default function AppointmentManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual API call
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      firstName: "Jane",
      lastName: "Cooper",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "2",
      firstName: "Wade",
      lastName: "Warren",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Booked",
    },
    {
      id: "3",
      firstName: "Brooklyn",
      lastName: "Simmons",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Completed",
    },
    {
      id: "4",
      firstName: "Cameron",
      lastName: "Williamson",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "5",
      firstName: "Leslie",
      lastName: "Alexander",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "6",
      firstName: "Savannah",
      lastName: "Nguyen",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "7",
      firstName: "Darlene",
      lastName: "Robertson",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Completed",
    },
    {
      id: "8",
      firstName: "Ronald",
      lastName: "Richards",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "9",
      firstName: "Kathryn",
      lastName: "Murphy",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13-Aug-2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
    {
      id: "10",
      firstName: "Darrell",
      lastName: "Steward",
      phoneNumber: "+91 9876543210",
      petName: "Roxy",
      appointmentDate: "13 Aug 2023",
      appointmentTime: "10:00 AM",
      status: "Open",
    },
  ];

  const totalPages = Math.ceil(mockAppointments.length / itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">
          Appointment Management
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Pet Name
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Appointment Date & Time
                <svg
                  className="inline-block w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mockAppointments.map((appointment, index) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                isLast={index === mockAppointments.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 border-t border-slate-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
