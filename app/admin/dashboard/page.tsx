// app/admin/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminProfilePopover from "@/components/admin/AdminProfilePopover";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type {
  AdminDashboardAppointmentItem,
  AdminDashboardResponse,
  AdminDashboardStats,
  AdminDashboardUserItem,
} from "@/types/adminDashboard";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", active: true },
  { label: "Manage Users", href: "/admin/users/manage", active: false },
  { label: "Appointments", href: "/admin/appointments", active: false },
  { label: "Pets", href: "/admin/pets", active: false },
];

const headerActions = [
  {
    label: "Notifications",
    path: "M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18a2 2 0 01-.58 1.4L4 17h5m6 0a3 3 0 11-6 0",
  },
];

const defaultStats: AdminDashboardStats = {
  totalUsers: 0,
  petOwners: 0,
  doctors: 0,
  pharmacyStaff: 0,
};

const cardMeta: Array<{
  key: keyof AdminDashboardStats;
  title: string;
  subtitle: string;
  iconClass: string;
  cardClass: string;
  iconPath: string;
}> = [
  {
    key: "totalUsers",
    title: "Total Users",
    subtitle: "All registered users",
    iconClass: "bg-[#07b4a5]",
    cardClass: "from-[#ecf7f7] to-[#d5eeeb] border-[#c7e3df]",
    iconPath:
      "M16 14a4 4 0 00-8 0M12 11a3 3 0 100-6 3 3 0 000 6M5 18a3 3 0 113-3M19 18a3 3 0 10-3-3",
  },
  {
    key: "petOwners",
    title: "Pet Owners",
    subtitle: "Owner accounts",
    iconClass: "bg-[#ffb300]",
    cardClass: "from-[#fcf6e8] to-[#f7efdd] border-[#efdfbb]",
    iconPath: "M12 12a4 4 0 100-8 4 4 0 000 8M5 20a7 7 0 0114 0",
  },
  {
    key: "doctors",
    title: "Doctors",
    subtitle: "Doctor accounts",
    iconClass: "bg-[#3272ff]",
    cardClass: "from-[#f0f1fb] to-[#e6e9fa] border-[#d6daf2]",
    iconPath: "M12 12a4 4 0 100-8 4 4 0 000 8M5 20a7 7 0 0114 0",
  },
  {
    key: "pharmacyStaff",
    title: "Pharmacy Staff",
    subtitle: "Pharmacist accounts",
    iconClass: "bg-[#ff3f81]",
    cardClass: "from-[#fbeef4] to-[#f9e6f0] border-[#ecd1dd]",
    iconPath:
      "M16 14a4 4 0 00-8 0M12 11a3 3 0 100-6 3 3 0 000 6M5 18a3 3 0 113-3M19 18a3 3 0 10-3-3",
  },
];

function prettifyRole(role: string): string {
  if (!role) return "User";
  return role
    .replace(/^ROLE_/i, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getUserBadgeClass(role: string): string {
  const normalized = role.replace(/^ROLE_/i, "").toUpperCase();
  if (normalized === "ADMIN") return "bg-[#5564ef] text-white";
  if (normalized === "DOCTOR") return "bg-[#5c86ff] text-white";
  if (normalized === "PETOWNER") return "bg-[#9adfca] text-[#1f5d4f]";
  return "bg-[#f0df9f] text-[#946b00]";
}

function getUserStatusBadge(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "bg-[#daf4e6] text-[#1b8a61]";
  if (normalized === "SUSPENDED") return "bg-[#ffe7d9] text-[#b05118]";
  return "bg-[#f4c5cc] text-[#ab2b40]";
}

function getAppointmentBadge(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "CONFIRMED") return "bg-[#b4e2d9] text-[#2b6559]";
  if (normalized === "PENDING") return "bg-[#f0df9f] text-[#946b00]";
  if (normalized === "COMPLETED") return "bg-[#dce5ff] text-[#2a4eb8]";
  if (normalized === "IN_CONSULTATION") return "bg-[#dce5ff] text-[#2a4eb8]";
  return "bg-[#f4c5cc] text-[#ab2b40]";
}

export default function AdminDashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const profileContainerRef = useRef<HTMLDivElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Try primary route first, then fallback route for compatibility.
        let response: AdminDashboardResponse | null = null;
        try {
          response = await apiFetch<AdminDashboardResponse>("/api/dashboard/admin");
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            response = await apiFetch<AdminDashboardResponse>("/api/admin/dashboard");
          } else {
            throw error;
          }
        }

        setDashboard(response);
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Failed to load admin dashboard data.";
        setLoadError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, [user]);

  const stats = dashboard?.stats ?? defaultStats;
  const registrationRows = dashboard?.recentUsers ?? [];
  const appointmentRows = dashboard?.todayAppointments ?? [];

  const statsCards = useMemo(
    () =>
      cardMeta.map((card) => ({
        ...card,
        value: String(stats[card.key]),
      })),
    [stats],
  );

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!profileContainerRef.current) return;
      if (!profileContainerRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleProfileToggle = async () => {
    if (isProfileOpen) {
      setIsProfileOpen(false);
      return;
    }

    try {
      await refreshUser();
    } catch {
      // Keep popover usable even if refresh fails.
    }
    setIsProfileOpen(true);
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f5f4fb] text-[#1f2a59]">
        <header className="bg-gradient-to-r from-[#2a2f79] to-[#2b347f] text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-5 py-4 xl:px-8">
            <div className="flex items-center gap-6 xl:gap-10">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white/95">
                  <Image src="/logo.png" alt="PetCore logo" width={36} height={36} className="h-9 w-9 object-contain" priority />
                </div>

                <span className="text-lg font-semibold leading-none tracking-tight">PetCore</span>
              </div>

              <nav className="hidden items-center gap-2 md:flex lg:gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-4 py-2 text-xs transition-colors ${
                      item.active
                        ? "bg-white/10 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="relative flex items-center gap-3" ref={profileContainerRef}>
              {headerActions.map((action) => (
                <button
                  key={action.label}
                  className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10"
                  aria-label={action.label}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={action.path} />
                  </svg>
                </button>
              ))}

              <button
                onClick={logout}
                className="rounded-xl border border-white/30 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Logout
              </button>

              <button
                type="button"
                onClick={() => void handleProfileToggle()}
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-[#4b58ae] ring-offset-2 transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
                aria-haspopup="dialog"
                aria-expanded={isProfileOpen}
                aria-label="Open profile details"
              >
                {user.email[0]?.toUpperCase() || "D"}
              </button>

              {isProfileOpen && (
                <AdminProfilePopover
                  user={user}
                  onSaved={refreshUser}
                  onClose={() => setIsProfileOpen(false)}
                />
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1300px] px-5 pb-10 pt-10 xl:px-8 [&_h2]:text-lg [&_p]:text-sm [&_span]:text-xs [&_a]:text-xs [&_button]:text-xs">
          <h1 className="text-3xl font-semibold leading-none text-[#1d2553]">Dashboard</h1>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#6472a0]">
            <span>Admin Panel</span>
            <span className="text-[#98a4c7]">&gt;</span>
            <span className="text-[#2d396e]">Dashboard</span>
          </div>

          {loadError ? (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>
          ) : null}

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-[20px] border bg-gradient-to-br p-6 ${card.cardClass}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base text-[#2d365f]">{card.title}</p>
                    <p className="mt-2 text-xs text-[#5c668f]">{card.subtitle}</p>
                  </div>
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${card.iconClass} text-white`}>
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
                    </svg>
                  </div>
                </div>
                <p className="mt-7 text-2xl font-semibold leading-none text-[#1d2552]">{isLoading ? "..." : card.value}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-3">
            <div className="rounded-[20px] border border-[#d8dceb] bg-white/70 p-6 xl:col-span-2">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-[#1d2553]">Manage Users</h2>
                <button className="grid h-11 w-11 place-items-center rounded-xl border border-[#ced4e8] text-[#8d98bb]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-2xl bg-[#2f67ff] px-6 py-3 text-xs font-medium text-white shadow-sm">
                  + Add New User
                </button>
                <button className="rounded-2xl border border-[#d7dced] bg-[#f8f9ff] px-6 py-3 text-xs text-[#5b6999]">
                  View Roles & Permissions
                </button>
                <button className="rounded-2xl border border-[#d7dced] bg-[#f8f9ff] px-6 py-3 text-xs text-[#5b6999]">
                  Access User Logs
                </button>
              </div>

              <p className="mt-7 text-lg font-medium text-[#1f295a]">Recent Registrations</p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-[#dee1ef]">
                {registrationRows.length === 0 ? (
                  <div className="bg-white px-4 py-8 text-center text-sm text-[#65729e]">
                    {isLoading ? "Loading users..." : "No users found."}
                  </div>
                ) : (
                  registrationRows.map((row: AdminDashboardUserItem) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[1.6fr_0.6fr_0.35fr] items-center border-b border-[#eceef6] bg-white px-4 py-4 text-xs last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-full text-sm font-semibold ${getUserBadgeClass(row.role)}`}
                        >
                          {getInitials(row.displayName)}
                        </div>
                        <div>
                          <p className="text-[#1f2957]">{row.displayName}</p>
                          <p className="text-xs text-[#65729e]">{row.email}</p>
                        </div>
                      </div>
                      <p className="text-[#516090]">{prettifyRole(row.role)}</p>
                      <span className={`inline-flex w-fit rounded-xl px-3 py-1 text-xs ${getUserStatusBadge(row.status)}`}>
                        {prettifyRole(row.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-[#d8dceb] bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#1d2553]">Today&apos;s Appointments</h2>
                <Link href="/admin/appointments" className="text-xs text-[#2366ff] hover:underline">
                  View All
                </Link>
              </div>

              <div className="mt-4 divide-y divide-[#e8eaf4] rounded-2xl border border-[#e4e7f3] bg-white">
                {appointmentRows.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[#65729e]">
                    {isLoading ? "Loading appointments..." : "No appointments for today."}
                  </div>
                ) : (
                  appointmentRows.map((row: AdminDashboardAppointmentItem) => (
                    <div key={row.id} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-full text-sm font-medium ${getAppointmentBadge(row.status)}`}
                        >
                          {getInitials(row.petName).slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-base font-medium text-[#1f295a]">{row.petName}</p>
                          <p className="text-xs text-[#4a5688]">{row.ownerName}</p>
                          <p className="text-xs text-[#6a759f]">{row.doctorName}</p>
                        </div>
                      </div>

                      <p className="text-base font-medium text-[#1e2957]">{row.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

