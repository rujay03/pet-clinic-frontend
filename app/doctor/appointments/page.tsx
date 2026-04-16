// app/doctor/appointments/page.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppointmentManagementTable from "@/components/doctor/appointments/AppointmentManagementTable";

function TopNavBar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/doctor/dashboard" },
    { name: "Appointments", href: "/doctor/appointments" },
    { name: "Pets", href: "/doctor/manage-pets" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      localStorage.removeItem("token");
      router.push("/doctor/login");
    }
  };

  return (
    <nav className="bg-[#2D2B6B] px-6 py-3 text-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/doctor/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wide">PetCore</span>
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/90">Hello Dr. {userEmail?.split("@")[0] || "Doctor"}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/40 px-4 py-1.5 text-sm font-medium hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

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
            <h1 className="text-5xl font-semibold text-[#22195E]">Appointments</h1>
            <p className="mt-1 text-2xl text-[#59529A]">Manage your appointments.</p>
          </div>

          <AppointmentManagementTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
