// app/doctor/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { MeResponse } from "@/types/auth";
import DoctorShell from "@/components/doctor/DoctorShell";

export default function DoctorDashboardPage() {
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
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-8">Welcome to the doctor portal</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Total Appointments</h3>
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900">124</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Pending</h3>
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900">23</p>
            <p className="text-sm text-slate-600 mt-2">Awaiting confirmation</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Completed</h3>
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900">101</p>
            <p className="text-sm text-slate-600 mt-2">Successfully treated</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Appointments Trend
            </h3>
            <p className="text-sm text-slate-500 mb-6">Last 7 days</p>
            <div className="h-64 flex items-end justify-between gap-2">
              {[45, 52, 38, 65, 48, 73, 60].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Appointment Status Distribution
            </h3>
            <p className="text-sm text-slate-500 mb-6">Current month</p>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Pie Chart using conic-gradient */}
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #10b981 0deg 180deg,
                      #f59e0b 180deg 270deg,
                      #ef4444 270deg 360deg
                    )`,
                  }}
                ></div>
                {/* Center circle */}
                <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">124</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Completed (62)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-600">Pending (31)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Cancelled (31)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Top Treatments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Treatment Types Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Top Treatment Types
            </h3>
            <p className="text-sm text-slate-500 mb-6">This month</p>
            <div className="space-y-4">
              {[
                { name: "Vaccination", count: 45, color: "bg-blue-500" },
                { name: "Routine Checkup", count: 38, color: "bg-green-500" },
                { name: "Dental Care", count: 28, color: "bg-purple-500" },
                { name: "Surgery", count: 15, color: "bg-red-500" },
                { name: "Emergency Care", count: 12, color: "bg-orange-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                    <span className="text-sm text-slate-500">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${(item.count / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Visits Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Daily Patient Visits
            </h3>
            <p className="text-sm text-slate-500 mb-6">Average per day</p>
            <div className="h-64 flex items-end justify-between gap-1">
              {[
                12, 15, 18, 14, 20, 16, 22, 19, 25, 21, 17, 23, 20, 18, 24, 22,
                19, 26, 23, 20, 28, 24, 21, 27, 25, 22, 29, 26, 23, 30,
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t hover:from-purple-700 hover:to-purple-500 transition-all"
                  style={{ height: `${(value / 30) * 100}%` }}
                  title={`${value} patients`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </DoctorShell>
  );
}
