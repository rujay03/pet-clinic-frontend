// app/doctor/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

/* ─── MOCK DATA ─── */
const trendData = [
  { day: "Mon", appointments: 18, trend: 20 },
  { day: "Tue", appointments: 22, trend: 19 },
  { day: "Wed", appointments: 15, trend: 22 },
  { day: "Thu", appointments: 28, trend: 25 },
  { day: "Fri", appointments: 20, trend: 23 },
  { day: "Sat", appointments: 30, trend: 28 },
  { day: "Sun", appointments: 25, trend: 26 },
];

const vaccinationData = [
  { name: "Rabies", value: 45, color: "#3B4CC0" },
  { name: "Distemper", value: 30, color: "#5EC4B6" },
  { name: "Parvovirus", value: 15, color: "#7BC67E" },
  { name: "Others", value: 10, color: "#E0DFF0" },
];

const patientVisitsData = [
  { day: "1", visits: 10 },
  { day: "2", visits: 8 },
  { day: "3", visits: 12 },
  { day: "4", visits: 15 },
  { day: "5", visits: 25 },
  { day: "6", visits: 18 },
  { day: "7", visits: 22 },
  { day: "8", visits: 28 },
  { day: "9", visits: 20 },
  { day: "10", visits: 30 },
  { day: "11", visits: 26 },
  { day: "13", visits: 12 },
  { day: "15", visits: 35 },
  { day: "15", visits: 28 },
  { day: "21", visits: 22 },
  { day: "31", visits: 18 },
];

const appointmentOverviewData = [
  { day: "1", scheduled: 18, pending: 8, cancelled: 3 },
  { day: "2", scheduled: 14, pending: 6, cancelled: 2 },
  { day: "3", scheduled: 20, pending: 10, cancelled: 4 },
  { day: "4", scheduled: 16, pending: 7, cancelled: 2 },
  { day: "5", scheduled: 22, pending: 9, cancelled: 3 },
  { day: "6", scheduled: 12, pending: 5, cancelled: 2 },
  { day: "7", scheduled: 25, pending: 11, cancelled: 4 },
  { day: "8", scheduled: 18, pending: 8, cancelled: 3 },
  { day: "9", scheduled: 28, pending: 12, cancelled: 5 },
  { day: "10", scheduled: 20, pending: 9, cancelled: 3 },
  { day: "11", scheduled: 24, pending: 10, cancelled: 4 },
  { day: "22", scheduled: 15, pending: 6, cancelled: 2 },
  { day: "23", scheduled: 30, pending: 13, cancelled: 5 },
  { day: "31", scheduled: 22, pending: 10, cancelled: 3 },
];

const treatmentTypes = [
  { name: "Skin Allergy Treatment", percentage: 35, color: "#4361EE" },
  { name: "Dental Cleaning", percentage: 20, color: "#3ECFB4" },
  { name: "Ear Infection Therapy", percentage: 18, color: "#6BCB77" },
  { name: "Wound Care", percentage: 15, color: "#F5C842" },
  { name: "Other", percentage: 30, color: "#EDE9B1" },
];

const upcomingPatients = [
  { petName: "Toby", ownerName: "Saran Miller", avatar: "🐶" },
  { petName: "Luna", ownerName: "James Turner", avatar: "🐱" },
  { petName: "Max", ownerName: "Emily Watson", avatar: "🐕" },
  { petName: "Bella", ownerName: "Michael Brown", avatar: "🐶" },
];

/* ─── CUSTOM PIE LABEL ─── */
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

/* ─── TOP NAVIGATION BAR ─── */
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
      {/* Left: Logo + Nav links */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/doctor/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-wide">PetCore</span>
        </Link>

        {/* Nav Links */}
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
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">
          Hello Dr. {userEmail?.split("@")[0] || "John Adams"}
        </span>
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

/* ─── MAIN PAGE ─── */
export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [trendTab, setTrendTab] = useState<"7d" | "30d" | "year">("7d");

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-[#EDEAF4]">
        {/* Top Navigation */}
        <TopNavBar userEmail={user.email} />

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of clinic performance and patient statistics.
            </p>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Appointments */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Total</p>
                <p className="text-sm text-slate-500">Appointments</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-sm font-semibold text-green-500">+12</span>
                <p className="text-xs text-slate-400">this week</p>
              </div>
            </div>

            {/* Consultations */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Consultations</p>
                <p className="text-2xl font-bold text-slate-900">65</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-400">today</p>
              </div>
            </div>

            {/* Vaccinations */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-slate-500">Vaccinations</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-sm font-semibold text-green-500">+1</span>
                <p className="text-xs text-slate-400">today</p>
              </div>
            </div>

            {/* Total Patients */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">340</p>
                <p className="text-sm text-slate-500">Total Patients</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-semibold text-slate-700">
                  T <span className="text-indigo-600">908</span>{" "}
                  <span className="text-xs text-slate-400">↔</span>
                </p>
                <p className="text-xs text-slate-400">week</p>
              </div>
            </div>
          </div>

          {/* Middle Row: Appointments Trends + Vaccination Types */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Appointments Trends - Takes 3 columns */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Appointments Trends</h2>
              </div>
              {/* Tabs */}
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
                {/* Patient list - Left side */}
                <div className="w-48 flex-shrink-0 space-y-3">
                  {upcomingPatients.map((patient, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                        {patient.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{patient.petName}</p>
                        <p className="text-xs text-slate-400">{patient.ownerName}</p>
                      </div>
                    </div>
                  ))}

                  {/* Start button */}
                  <button className="mt-2 px-4 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1">
                    Start <span>›</span>
                  </button>

                  {/* Stats */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500">780</span>
                      <span className="text-slate-500">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-500">640</span>
                      <span className="text-slate-500">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500">45</span>
                      <span className="text-slate-500">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500">95</span>
                      <span className="text-slate-500">Cancelled</span>
                    </div>
                  </div>
                </div>

                {/* Chart - Right side */}
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

            {/* Vaccination Types - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Vaccination Types</h2>
              <div className="flex items-center gap-4">
                {/* Pie Chart */}
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

                {/* Legend - middle */}
                <div className="space-y-2 text-xs">
                  {vaccinationData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                      <span className="text-slate-400">{item.value}%</span>
                    </div>
                  ))}
                </div>

                {/* Table - right */}
                <div className="ml-auto space-y-2 text-xs">
                  {vaccinationData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Patient Visits + Appointment Overview + Top Treatment Types */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Patient Visits This Month */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Patient Visits This Month</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientVisitsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#93C5FD" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Appointment Overview */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-2">Appointment Overview</h2>
              {/* Legend */}
              <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]" />
                  <span className="text-slate-500">Scheduled</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6BCB77]" />
                  <span className="text-slate-500">35%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
                  <span className="text-slate-500">9%</span>
                </div>
                <span className="text-slate-500 text-xs">8%</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentOverviewData}>
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

            {/* Top Treatment Types */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Top Treatment Types</h2>
              <div className="space-y-4">
                {treatmentTypes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


