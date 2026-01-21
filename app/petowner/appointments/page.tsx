// app/petowner/appointments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { MeResponse } from "@/types/auth";
import TopNav from "@/components/dashboard/TopNav";
import AppointmentsPageShell from "@/components/appointments/AppointmentsPageShell";

export default function PetOwnerAppointmentsPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      try {
        const data = await apiFetch<MeResponse>("/api/auth/me", {
          method: "GET",
        });
        if (!mounted) return;
        setMe(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/auth/login");
        } else {
          console.error("Failed to load /me:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMe();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.replace("/auth/login");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading appointments...</p>
      </main>
    );
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav userEmail={me.email} onLogout={handleLogout} />
      <AppointmentsPageShell />
    </div>
  );
}
