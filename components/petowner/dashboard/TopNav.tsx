// components/dashboard/TopNav.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopNavProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function TopNav({ userEmail, onLogout }: TopNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/petowner/dashboard", label: "Dashboard" },
    { href: "/petowner/pets", label: "Pets" },
    { href: "/petowner/appointments", label: "Appointments" },
    { href: "/petowner/records", label: "Pet records" },
  ];

  const isActiveTab = (href: string) => {
    if (href === "/petowner/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="w-full bg-primary text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: logo + brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image src="/logo.png" alt="PetCare Logo" width={32} height={32} />
          </div>
          <span className="text-lg font-semibold">PetCore</span>
        </div>

        {/* Center: navigation links */}
        <nav className="hidden items-center gap-3 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = isActiveTab(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "rounded-full bg-white/20 px-3 py-1.5 font-semibold text-white ring-1 ring-white/40"
                    : "rounded-full px-3 py-1.5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden text-xs text-slate-200 md:inline">
              {userEmail}
            </span>
          )}
          <button
            onClick={onLogout}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 hover:bg-white"
          >
            Log out
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-900">
            {/* Simple avatar placeholder */}
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
