"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TopNav from "@/components/petowner/dashboard/TopNav";
import DashboardShell from "@/components/petowner/dashboard/DashboardShell";

export default function PetOwnerDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["PETOWNER"]}>
      <div className="min-h-screen bg-gray-50">
        <TopNav userEmail={user?.email} onLogout={logout} />
        <DashboardShell />
      </div>
    </ProtectedRoute>
  );
}
