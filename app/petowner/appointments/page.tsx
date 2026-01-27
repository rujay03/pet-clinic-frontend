// app/petowner/appointments/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TopNav from "@/components/petowner/dashboard/TopNav";
import AppointmentsPageShell from "@/components/petowner/appointments/AppointmentsPageShell";

export default function PetOwnerAppointmentsPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["PETOWNER"]}>
      <div className="min-h-screen bg-slate-50">
        <TopNav userEmail={user.email} onLogout={logout} />
        <AppointmentsPageShell />
      </div>
    </ProtectedRoute>
  );
}
