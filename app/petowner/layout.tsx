"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TopNav from "@/components/petowner/dashboard/TopNav";

interface PetOwnerLayoutProps {
  children: ReactNode;
}

export default function PetOwnerLayout({ children }: PetOwnerLayoutProps) {
  const pathname = usePathname();
  const { user, logout, refreshUser } = useAuth();

  // Booking views are presented as standalone screens/modals.
  const hideTopNav = pathname.startsWith("/petowner/booking");

  return (
    <ProtectedRoute allowedRoles={["PETOWNER"]}>
      <div className="min-h-screen bg-slate-50">
        {!hideTopNav && (
          <TopNav user={user} onLogout={logout} onProfileSaved={refreshUser} />
        )}
        {children}
      </div>
    </ProtectedRoute>
  );
}
