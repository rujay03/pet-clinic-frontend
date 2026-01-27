// components/pharmacy-staff/PharmacyShell.tsx
"use client";

import { ReactNode } from "react";
import PharmacySidebar from "./Sidebar";

interface PharmacyShellProps {
  children: ReactNode;
  userEmail?: string;
  onLogout?: () => void;
}

export default function PharmacyShell({
  children,
  userEmail,
  onLogout,
}: PharmacyShellProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <PharmacySidebar onLogout={onLogout} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-slate-50 px-8 py-4 flex-shrink-0 border-b border-slate-200">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              {/* Greeting and Date */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Good Morning
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentDate} {currentTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
