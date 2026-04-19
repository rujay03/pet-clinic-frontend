// app/doctor/dashboard/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ProfilePopover from "@/components/doctor/ProfilePopover";
import type { DoctorDashboardResponse } from "@/types/doctorDashboard";
import type { MeResponse } from "@/types/auth";
import Image from "next/image";
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

function escapeCsvValue(value: string | number | null | undefined): string {
  const normalized = String(value ?? "").replace(/"/g, '""');
  return `"${normalized}"`;
}

function buildDoctorDashboardCsv(data: DoctorDashboardResponse): string {
  const rows: Array<Array<string | number>> = [];

  rows.push(["Doctor Dashboard Report"]);
  rows.push(["Generated At", new Date().toLocaleString()]);
  rows.push([]);

  rows.push(["KPIs"]);
  rows.push(["Total Appointments", "Consultations", "Vaccinations", "Total Patients"]);
  rows.push([
    data.kpis.totalAppointments,
    data.kpis.consultations,
    data.kpis.vaccinations,
    data.kpis.totalPatients,
  ]);
  rows.push([]);

  rows.push(["Appointment Status Summary"]);
  rows.push(["Scheduled", "Completed", "Pending", "Cancelled"]);
  rows.push([
    data.appointmentStatusSummary.scheduled,
    data.appointmentStatusSummary.completed,
    data.appointmentStatusSummary.pending,
    data.appointmentStatusSummary.cancelled,
  ]);
  rows.push([]);

  rows.push(["Appointment Trends - Last 30 Days"]);
  rows.push(["Label", "Appointments", "Trend"]);
  data.appointmentTrendsLast30Days.forEach((item) => {
    rows.push([item.label, item.appointments, item.trend]);
  });
  rows.push([]);

  rows.push(["Appointment Trends - This Year"]);
  rows.push(["Label", "Appointments", "Trend"]);
  data.appointmentTrendsThisYear.forEach((item) => {
    rows.push([item.label, item.appointments, item.trend]);
  });
  rows.push([]);

  rows.push(["Vaccination Types"]);
  rows.push(["Name", "Value"]);
  data.vaccinationTypes.forEach((item) => {
    rows.push([item.name, item.value]);
  });
  rows.push([]);

  rows.push(["Patient Visits This Month"]);
  rows.push(["Day", "Visits"]);
  data.patientVisitsThisMonth.forEach((item) => {
    rows.push([item.day, item.visits]);
  });
  rows.push([]);

  rows.push(["Appointment Overview This Month"]);
  rows.push(["Day", "Scheduled", "Pending", "Cancelled"]);
  data.appointmentOverviewThisMonth.forEach((item) => {
    rows.push([item.day, item.scheduled, item.pending, item.cancelled]);
  });
  rows.push([]);

  rows.push(["Top Treatment Types"]);
  rows.push(["Name", "Value"]);
  data.topTreatmentTypes.forEach((item) => {
    rows.push([item.name, item.value]);
  });
  rows.push([]);

  rows.push(["Upcoming Patients"]);
  rows.push(["Pet Name", "Owner Name"]);
  data.upcomingPatients.forEach((item) => {
    rows.push([item.petName, item.ownerName]);
  });

  return rows.map((row) => row.map((cell) => escapeCsvValue(cell)).join(",")).join("\n");
}

function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function downloadHtmlFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function toSvgBarChart(
  points: Array<{ label: string; value: number }>,
  color: string,
  width = 720,
  height = 220,
): string {
  if (!points.length) {
    return `<p class="muted">No data available.</p>`;
  }

  const max = Math.max(...points.map((p) => p.value), 1);
  const chartHeight = 150;
  const baseY = 170;
  const barGap = 8;
  const barWidth = Math.max(14, Math.floor((width - 70) / points.length) - barGap);

  const bars = points
    .map((point, index) => {
      const x = 40 + index * (barWidth + barGap);
      const barHeight = Math.round((point.value / max) * chartHeight);
      const y = baseY - barHeight;
      const label = String(point.label).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="${color}" />
        <text x="${x + barWidth / 2}" y="${baseY + 14}" text-anchor="middle" font-size="10" fill="#475569">${label}</text>
        <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" font-size="10" fill="#0f172a">${point.value}</text>
      `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Bar chart">
      <line x1="34" y1="170" x2="${width - 10}" y2="170" stroke="#cbd5e1" stroke-width="1" />
      ${bars}
    </svg>
  `;
}

function toSvgPieChart(
  points: Array<{ label: string; value: number; color: string }>,
  size = 220,
): string {
  const total = points.reduce((sum, point) => sum + point.value, 0);
  if (!points.length || total <= 0) {
    return `<p class="muted">No data available.</p>`;
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = Math.min(size / 2 - 10, 90);
  let startAngle = -Math.PI / 2;

  const slices = points
    .map((point) => {
      const angle = (point.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;
      return `<path d="${path}" fill="${point.color}" />`;
    })
    .join("");

  const legend = points
    .map((point) => {
      const pct = Math.round((point.value / total) * 100);
      const safeLabel = String(point.label).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="legend-item"><span class="legend-dot" style="background:${point.color}"></span><span>${safeLabel} (${pct}%)</span></div>`;
    })
    .join("");

  return `
    <div class="pie-wrap">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Pie chart">
        ${slices}
      </svg>
      <div class="legend">${legend}</div>
    </div>
  `;
}

function buildDoctorDashboardVisualHtml(data: DoctorDashboardResponse): string {
  const generatedAt = new Date().toLocaleString();
  const trends = data.appointmentTrendsLast30Days.slice(-12).map((item) => ({ label: item.label, value: item.appointments }));
  const visits = data.patientVisitsThisMonth.map((item) => ({ label: item.day, value: item.visits }));
  const vaccinations = data.vaccinationTypes.map((item, index) => ({
    label: item.name,
    value: item.value,
    color: VACCINATION_COLORS[index % VACCINATION_COLORS.length],
  }));

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Doctor Dashboard Visual Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
    h1 { margin: 0 0 4px 0; }
    h2 { margin: 20px 0 10px 0; font-size: 18px; }
    .muted { color: #64748b; }
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; }
    .kpi .value { font-size: 22px; font-weight: 700; }
    .chart-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
    .pie-wrap { display: flex; align-items: center; gap: 16px; }
    .legend { display: flex; flex-direction: column; gap: 6px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 13px; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  <h1>Doctor Dashboard Visual Report</h1>
  <p class="muted">Generated at: ${generatedAt}</p>

  <h2>KPIs</h2>
  <div class="kpis">
    <div class="kpi"><div>Total Appointments</div><div class="value">${data.kpis.totalAppointments}</div></div>
    <div class="kpi"><div>Consultations</div><div class="value">${data.kpis.consultations}</div></div>
    <div class="kpi"><div>Vaccinations</div><div class="value">${data.kpis.vaccinations}</div></div>
    <div class="kpi"><div>Total Patients</div><div class="value">${data.kpis.totalPatients}</div></div>
  </div>

  <h2>Graphs</h2>
  <div class="chart-card">
    <h3>Appointment Trend (Recent 12 Points)</h3>
    ${toSvgBarChart(trends, "#6366f1")}
  </div>

  <div class="chart-card">
    <h3>Patient Visits (This Month)</h3>
    ${toSvgBarChart(visits, "#0ea5e9")}
  </div>

  <div class="chart-card">
    <h3>Vaccination Distribution</h3>
    ${toSvgPieChart(vaccinations)}
  </div>

  <h2>Upcoming Patients</h2>
  <table>
    <thead><tr><th>Pet Name</th><th>Owner Name</th></tr></thead>
    <tbody>
      ${data.upcomingPatients.map((item) => `<tr><td>${item.petName}</td><td>${item.ownerName}</td></tr>`).join("") || "<tr><td colspan=\"2\">No upcoming patients.</td></tr>"}
    </tbody>
  </table>
</body>
</html>`;
}

function TopNavBar({ user }: { user: MeResponse }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, refreshUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { name: "Dashboard", href: "/doctor/dashboard" },
    { name: "Appointments", href: "/doctor/appointments" },
    { name: "Pets", href: "/doctor/manage-pets" },
  ];

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
      // Keep popover available even when refresh fails.
    }

    setIsProfileOpen(true);
  };

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
          <Image
            src="/logo.svg"
            alt="PetCore logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
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

      <div className="relative flex items-center gap-4" ref={profileContainerRef}>
        <span className="text-sm text-white/90">Hello Dr. {user.email?.split("@")[0] || "Doctor"}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm font-medium border border-white/40 rounded-lg hover:bg-white/10 transition-colors"
        >
          Log out
        </button>
        <button
          type="button"
          onClick={() => void handleProfileToggle()}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-xs font-semibold text-[#2D2B6B] ring-offset-2 transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
          aria-haspopup="dialog"
          aria-expanded={isProfileOpen}
          aria-label="Open profile details"
        >
          {user.email[0]?.toUpperCase() || "D"}
        </button>

        {isProfileOpen && (
          <ProfilePopover
            user={user}
            onSaved={refreshUser}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisualDownloading, setIsVisualDownloading] = useState(false);

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

  const handleDownloadReport = () => {
    if (!dashboard || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      const csvContent = buildDoctorDashboardCsv(dashboard);
      const datePart = new Date().toISOString().slice(0, 10);
      downloadCsvFile(csvContent, `doctor-dashboard-report-${datePart}.csv`);
    } catch {
      setError("Failed to download report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadVisualReport = () => {
    if (!dashboard || isVisualDownloading) {
      return;
    }

    try {
      setIsVisualDownloading(true);
      const htmlContent = buildDoctorDashboardVisualHtml(dashboard);
      const datePart = new Date().toISOString().slice(0, 10);
      downloadHtmlFile(htmlContent, `doctor-dashboard-visual-report-${datePart}.html`);
    } catch {
      setError("Failed to download visual report.");
    } finally {
      setIsVisualDownloading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-[#EDEAF4]">
        <TopNavBar user={user} />

        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Overview of clinic performance and patient statistics.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={loading || !dashboard || isDownloading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? "Preparing CSV..." : "Download CSV Report"}
              </button>
              <button
                type="button"
                onClick={handleDownloadVisualReport}
                disabled={loading || !dashboard || isVisualDownloading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVisualDownloading ? "Preparing Visual..." : "Download Visual Report"}
              </button>
            </div>
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

