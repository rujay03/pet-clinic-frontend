// app/doctor/appointments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { MeResponse } from "@/types/auth";
import DoctorShell from "@/components/doctor/DoctorShell";
import AppointmentManagementTable from "@/components/doctor/appointments/AppointmentManagementTable";

export default function DoctorAppointmentsPage() {
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
        // Backend not available or authentication failed - use mock data for development
        if (err instanceof ApiError && err.status === 401) {
          // Uncomment to enforce authentication
          // router.replace("/doctor/login");
          console.log("Not authenticated, using mock user");
        } else {
          console.log("Backend not available, using mock user for development");
        }
        // Use mock data for development when backend is not available
        if (!mounted) return;
        setMe({ email: "doctor@example.com", roles: ["doctor"] });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMe();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <DoctorShell userEmail={me.email}>
      <AppointmentManagementTable />
    </DoctorShell>
  );
}
