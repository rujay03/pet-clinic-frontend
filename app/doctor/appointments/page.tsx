// app/doctor/appointments/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppointmentManagementTable from "@/components/doctor/appointments/AppointmentManagementTable";
import TopNavBar from "@/components/doctor/TopNavBar";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-[#EDEAF4]">
        <TopNavBar userEmail={user.email} />

        <div className="mx-auto w-full max-w-[1400px] px-6 py-7">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-[#22195E]">Appointments</h1>
            <p className="mt-1 text-2xl text-[#59529A]">Manage your appointments.</p>
          </div>

          <AppointmentManagementTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
