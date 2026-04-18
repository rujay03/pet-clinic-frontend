// app/admin/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", active: true },
  { label: "Manage Users", href: "/admin/users/manage", active: false },
  { label: "Appointments", href: "/admin/appointments", active: false },
  { label: "Pets", href: "#", active: false },
  { label: "Medicine", href: "#", active: false },
];

const registrationRows = [
  {
    initials: "HS",
    name: "Hirusha Subasinghe",
    email: "admin@petcore.com",
    role: "Admin",
    badgeClass: "bg-[#5564ef] text-white",
  },
  {
    initials: "KP",
    name: "Dr. Kishani Perera",
    email: "kishani@petcore.com",
    role: "Doctor",
    badgeClass: "bg-[#5c86ff] text-white",
  },
  {
    initials: "TD",
    name: "Thilini Dasanayake",
    email: "thilini@petcore.com",
    role: "Pet Owner",
    badgeClass: "bg-[#9adfca] text-[#1f5d4f]",
  },
];

const appointmentRows = [
  {
    initials: "K",
    name: "Kitty",
    owner: "Thilini Dasayake",
    doctor: "Dr. Kishani Perera",
    time: "10:00 AM",
    badgeClass: "bg-[#f0df9f] text-[#946b00]",
  },
  {
    initials: "M",
    name: "Max",
    owner: "John Wick",
    doctor: "Dr. Kavindu Perera",
    time: "02:00 PM",
    badgeClass: "bg-[#b4e2d9] text-[#2b6559]",
  },
  {
    initials: "B",
    name: "Bella",
    owner: "Hirusha Subasinghe",
    doctor: "Dr. Kavindu Perera",
    time: "04:00 PM",
    badgeClass: "bg-[#f4c5cc] text-[#ab2b40]",
  },
];

const statsCards = [
  {
    title: "Total Users",
    subtitle: "All system users",
    value: "185",
    iconClass: "bg-[#07b4a5]",
    cardClass: "from-[#ecf7f7] to-[#d5eeeb] border-[#c7e3df]",
    iconPath:
      "M16 14a4 4 0 00-8 0M12 11a3 3 0 100-6 3 3 0 000 6M5 18a3 3 0 113-3M19 18a3 3 0 10-3-3",
  },
  {
    title: "Pet Owners",
    subtitle: "Active accounts",
    value: "118",
    iconClass: "bg-[#ffb300]",
    cardClass: "from-[#fcf6e8] to-[#f7efdd] border-[#efdfbb]",
    iconPath: "M12 12a4 4 0 100-8 4 4 0 000 8M5 20a7 7 0 0114 0",
  },
  {
    title: "Doctors",
    subtitle: "Licensed doctors",
    value: "21",
    iconClass: "bg-[#3272ff]",
    cardClass: "from-[#f0f1fb] to-[#e6e9fa] border-[#d6daf2]",
    iconPath: "M12 12a4 4 0 100-8 4 4 0 000 8M5 20a7 7 0 0114 0",
  },
  {
    title: "Pharmacy & Staff",
    subtitle: "POS & reception",
    value: "46",
    iconClass: "bg-[#ff3f81]",
    cardClass: "from-[#fbeef4] to-[#f9e6f0] border-[#ecd1dd]",
    iconPath:
      "M16 14a4 4 0 00-8 0M12 11a3 3 0 100-6 3 3 0 000 6M5 18a3 3 0 113-3M19 18a3 3 0 10-3-3",
  },
];

const headerActions = [
  {
    label: "Search",
    path: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
  },
  {
    label: "Quick Search",
    path: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
  },
  {
    label: "Notifications",
    path: "M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18a2 2 0 01-.58 1.4L4 17h5m6 0a3 3 0 11-6 0",
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

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
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-[#2a3889]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2l7 4v6c0 5-3.5 9.2-7 10-3.5-.8-7-5-7-10V6l7-4z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
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

            <div className="flex items-center gap-3">
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

              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-[#4b58ae]">
                {user.email[0]?.toUpperCase() || "D"}
              </div>
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

          <section className="mt-8 grid gap-5 xl:grid-cols-3">
            <div className="grid gap-5 md:grid-cols-2 xl:col-span-2">
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
                  <p className="mt-7 text-2xl font-semibold leading-none text-[#1d2552]">{card.value}</p>
                  <p className="mt-3 text-xs text-[#5d678f]">{card.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[20px] border border-[#d9dced] bg-white/70 p-6">
              <h2 className="font-semibold text-[#1d2553]">System Status</h2>

              <div className="mt-6 space-y-6 text-[#2c3664]">
                <div className="flex items-start justify-between border-b border-[#e8eaf5] pb-5">
                  <div>
                    <p className="text-xl font-medium text-[#16b58e]">+18 New</p>
                    <p className="mt-1 text-xs text-[#62709d]">(last 7 days) ^</p>
                  </div>
                  <div className="text-right text-xl font-semibold text-[#15b287]">
                    <p>+18</p>
                    <p className="text-sm">^ 2</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#e8eaf5] pb-5">
                  <p className="text-base">Blocked accounts</p>
                  <p className="text-xl font-semibold text-[#eb364f]">3</p>
                </div>

                <div className="flex items-center justify-between text-base">
                  <p>Last backup</p>
                  <p>Today 02:15 AM</p>
                </div>

                <p className="text-base">Admin Activity</p>
              </div>
            </div>
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
                {registrationRows.map((row) => (
                  <div
                    key={row.email}
                    className="grid grid-cols-[1.6fr_0.6fr_0.35fr] items-center border-b border-[#eceef6] bg-white px-4 py-4 text-xs last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-full text-sm font-semibold ${row.badgeClass}`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-[#1f2957]">{row.name}</p>
                        <p className="text-xs text-[#65729e]">{row.email}</p>
                      </div>
                    </div>
                    <p className="text-[#516090]">{row.role}</p>
                    <span className="inline-flex w-fit rounded-xl bg-[#daf4e6] px-3 py-1 text-xs text-[#1b8a61]">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-[#d8dceb] bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#1d2553]">Today&apos;s Appointments</h2>
                <Link href="#" className="text-xs text-[#2366ff] hover:underline">
                  View All
                </Link>
              </div>

              <div className="mt-4 divide-y divide-[#e8eaf4] rounded-2xl border border-[#e4e7f3] bg-white">
                {appointmentRows.map((row) => (
                  <div key={`${row.name}-${row.time}`} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-full text-sm font-medium ${row.badgeClass}`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-base font-medium text-[#1f295a]">{row.name}</p>
                        <p className="text-xs text-[#4a5688]">{row.owner}</p>
                        <p className="text-xs text-[#6a759f]">{row.doctor}</p>
                      </div>
                    </div>
                    <p className="text-base font-medium text-[#1e2957]">{row.time}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <Link href="#" className="text-xs text-[#2366ff] hover:underline">
                  View All
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

