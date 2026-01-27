"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TopNav from "@/components/petowner/dashboard/TopNav";
import PetRecordShell from "@/components/petowner/records/PetRecordShell";

export default function PetRecordsPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["PETOWNER"]}>
      <div className="min-h-screen bg-slate-50">
        <TopNav userEmail={user.email} onLogout={logout} />
        <PetRecordShell />
      </div>
    </ProtectedRoute>
  );
}
