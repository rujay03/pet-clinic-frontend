// app/doctor/appointments/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DoctorShell from "@/components/doctor/DoctorShell";
import AppointmentManagementTable from "@/components/doctor/appointments/AppointmentManagementTable";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <DoctorShell userEmail={user.email}>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
            <p className="text-slate-600 mt-1">Manage your appointments</p>
          </div>
          <AppointmentManagementTable />
        </div>
      </DoctorShell>
    </ProtectedRoute>
  );
}
