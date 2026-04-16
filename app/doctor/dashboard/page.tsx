// app/doctor/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { DoctorDashboardResponse } from "@/types/doctorDashboard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

const VACCINATION_COLORS = ["#3B4CC0", "#5EC4B6", "#7BC67E", "#E0DFF0", "#8B5CF6"];
const TREATMENT_COLORS = ["#4361EE", "#3ECFB4", "#6BCB77", "#F5C842", "#EDE9B1"];

const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const cxNum = Number(cx ?? 0);
  const cyNum = Number(cy ?? 0);
  const midAngleNum = Number(midAngle ?? 0);
  const innerR = Number(innerRadius ?? 0);
  const outerR = Number(outerRadius ?? 0);
  const pct = Number(percent ?? 0);
  const RADIAN = Math.PI / 180;
  const radius = innerR + (outerR - innerR) * 0.5;
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(pct * 100).toFixed(0)}%`}
    </text>
  );
};

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
    <nav className="bg-[#2D2B6B] text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/doctor/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
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
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">Hello Dr. {userEmail?.split("@")[0] || "Doctor"}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm font-medium border border-white/40 rounded-lg hover:bg-white/10 transition-colors"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [trendTab, setTrendTab] = useState<"7d" | "30d" | "year">("7d");
  const [dashboard, setDashboard] = useState<DoctorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<DoctorDashboardResponse>("/api/appointments/doctor/dashboard");
        if (!cancelled) {
          setDashboard(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return null;
  }

  const kpis = dashboard?.kpis;
  const statusSummary = dashboard?.appointmentStatusSummary;
  const statusTotal =
    (statusSummary?.scheduled ?? 0) +
    (statusSummary?.completed ?? 0) +
    (statusSummary?.pending ?? 0) +
    (statusSummary?.cancelled ?? 0);

  const baseTrend = trendTab === "year" ? dashboard?.appointmentTrendsThisYear ?? [] : dashboard?.appointmentTrendsLast30Days ?? [];
  const trendData = (trendTab === "7d" ? baseTrend.slice(-7) : baseTrend).map((point) => ({
    day: point.label,
    appointments: point.appointments,
    trend: point.trend,
  }));

  const vaccinationItems = dashboard?.vaccinationTypes ?? [];
  const vaccinationTotal = vaccinationItems.reduce((sum, item) => sum + item.value, 0);
  const vaccinationData = vaccinationItems.map((item, idx) => ({
    name: item.name,
    value: vaccinationTotal > 0 ? Math.round((item.value * 100) / vaccinationTotal) : 0,
    color: VACCINATION_COLORS[idx % VACCINATION_COLORS.length],
  }));

  const treatmentTypes = (dashboard?.topTreatmentTypes ?? []).map((item, idx) => ({
    name: item.name,
    percentage: item.value,
    color: TREATMENT_COLORS[idx % TREATMENT_COLORS.length],
  }));

  const upcomingPatients = (dashboard?.upcomingPatients ?? []).map((patient) => ({
    petName: patient.petName,
    ownerName: patient.ownerName,
    avatar: (patient.petName || "P").trim().charAt(0).toUpperCase(),
  }));

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-[#EDEAF4]">
        <TopNavBar userEmail={user.email} />

        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of clinic performance and patient statistics.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}
          {loading && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Loading dashboard data...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Appointments</p>
                <p className="text-2xl font-bold text-slate-900">{kpis?.totalAppointments ?? 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Consultations</p>
                <p className="text-2xl font-bold text-slate-900">{kpis?.consultations ?? 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Vaccinations</p>
                <p className="text-2xl font-bold text-slate-900">{kpis?.vaccinations ?? 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900">{kpis?.totalPatients ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Appointments Trends</h2>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[
                  { key: "7d" as const, label: "Last 7 Days" },
                  { key: "30d" as const, label: "Last 30 Days" },
                  { key: "year" as const, label: "This Year" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setTrendTab(tab.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      trendTab === tab.key
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : "text-slate-500 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="w-48 flex-shrink-0 space-y-3">
                  {upcomingPatients.map((patient, idx) => (
                    <div key={`${patient.petName}-${idx}`} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                        {patient.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{patient.petName}</p>
                        <p className="text-xs text-slate-400">{patient.ownerName}</p>
                      </div>
                    </div>
                  ))}
                  {upcomingPatients.length === 0 && <p className="text-xs text-slate-500">No upcoming patients.</p>}

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600">{statusSummary?.scheduled ?? 0}</span>
                      <span className="text-slate-500">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">{statusSummary?.completed ?? 0}</span>
                      <span className="text-slate-500">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-600">{statusSummary?.pending ?? 0}</span>
                      <span className="text-slate-500">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-600">{statusSummary?.cancelled ?? 0}</span>
                      <span className="text-slate-500">Cancelled</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#C7D2FE" radius={[2, 2, 0, 0]} barSize={20} />
                      <Line type="monotone" dataKey="trend" stroke="#4361EE" strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: "#4361EE", strokeWidth: 2 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Vaccination Types</h2>
              <div className="flex items-center gap-4">
                <div className="w-44 h-44 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vaccinationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={70}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {vaccinationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {vaccinationData.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                      <span className="text-slate-400">{item.value}%</span>
                    </div>
                  ))}
                  {vaccinationData.length === 0 && <p className="text-xs text-slate-500">No vaccination data yet.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Patient Visits This Month</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard?.patientVisitsThisMonth ?? []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#93C5FD" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-2">Appointment Overview</h2>
              <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]" />
                  <span className="text-slate-500">Scheduled</span>
                </div>
                <span className="text-slate-500">{statusTotal > 0 ? Math.round(((statusSummary?.scheduled ?? 0) * 100) / statusTotal) : 0}%</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6BCB77]" />
                  <span className="text-slate-500">Pending</span>
                </div>
                <span className="text-slate-500">{statusTotal > 0 ? Math.round(((statusSummary?.pending ?? 0) * 100) / statusTotal) : 0}%</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
                  <span className="text-slate-500">Cancelled</span>
                </div>
                <span className="text-slate-500">{statusTotal > 0 ? Math.round(((statusSummary?.cancelled ?? 0) * 100) / statusTotal) : 0}%</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard?.appointmentOverviewThisMonth ?? []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="scheduled" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} barSize={14} />
                    <Bar dataKey="pending" stackId="a" fill="#6BCB77" barSize={14} />
                    <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Top Treatment Types</h2>
              <div className="space-y-4">
                {treatmentTypes.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.percentage}%</span>
                  </div>
                ))}
                {treatmentTypes.length === 0 && <p className="text-sm text-slate-500">No treatment data yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

