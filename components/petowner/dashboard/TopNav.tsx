// components/dashboard/TopNav.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MeResponse } from "@/types/auth";
import PetOwnerProfilePopover from "@/components/petowner/dashboard/PetOwnerProfilePopover";

interface TopNavProps {
  user?: MeResponse | null;
  onLogout?: () => void;
  onProfileSaved?: () => void | Promise<void>;
}

export default function TopNav({
  user,
  onLogout,
  onProfileSaved,
}: TopNavProps) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement | null>(null);

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
        <div className="relative flex items-center gap-3" ref={profileContainerRef}>
          {user?.email && (
            <span className="hidden text-xs text-slate-200 md:inline">
              {user.email}
            </span>
          )}
          <button
            onClick={onLogout}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 hover:bg-white"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-900 ring-offset-2 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            aria-label="Open profile details"
          >
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </button>

          {isProfileOpen && (
            <PetOwnerProfilePopover
              user={user}
              onSaved={onProfileSaved}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
