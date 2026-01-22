// app/pharmacy-staff/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { MeResponse } from "@/types/auth";
import PharmacyShell from "@/components/pharmacy-staff/PharmacyShell";
import KpiCard from "@/components/pharmacy-staff/dashboard/KpiCard";
import DashboardSection from "@/components/pharmacy-staff/dashboard/DashboardSection";

export default function PharmacyStaffDashboardPage() {
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
        // Backend not available - use mock data for development
        if (!mounted) return;
        setMe({ email: "pharmacy@example.com", roles: ["pharmacy-staff"] });
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
    <PharmacyShell userEmail={me.email}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              A quick data overview of the inventory.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            Download Report
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Inventory Status"
            value="Good"
            subtitle=""
            icon={
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
            actionText="View Detailed Report"
            actionLink="/pharmacy-staff/inventory"
            borderColor="border-green-200"
            bgColor="bg-green-50"
            iconBgColor="bg-green-100"
          />
          <KpiCard
            title="Revenue : Jan 2022"
            value="Rs. 8,55,875"
            subtitle=""
            icon={
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            actionText="View Detailed Report"
            actionLink="/pharmacy-staff/revenue"
            borderColor="border-yellow-200"
            bgColor="bg-yellow-50"
            iconBgColor="bg-yellow-100"
          />
          <KpiCard
            title="Medicines Available"
            value="298"
            subtitle=""
            icon={
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
            actionText="Visit Inventory"
            actionLink="/pharmacy-staff/inventory"
            borderColor="border-blue-200"
            bgColor="bg-blue-50"
            iconBgColor="bg-blue-100"
          />
          <KpiCard
            title="Medicine Shortage"
            value="01"
            subtitle=""
            icon={
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
            actionText="Resolve Now"
            actionLink="/pharmacy-staff/inventory"
            borderColor="border-red-200"
            bgColor="bg-red-50"
            iconBgColor="bg-red-100"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Inventory Section */}
          <DashboardSection title="Inventory" actionText="Go to Configuration">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">298</p>
                <p className="text-sm text-slate-600">Total no of Medicines</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">24</p>
                <p className="text-sm text-slate-600">Medicine Groups</p>
              </div>
            </div>
          </DashboardSection>

          {/* Quick Report Section */}
          <DashboardSection title="Quick Report" actionText="January 2022">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">70,856</p>
                <p className="text-sm text-slate-600">Qty of Medicines Sold</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">5,288</p>
                <p className="text-sm text-slate-600">Invoices Generated</p>
              </div>
            </div>
          </DashboardSection>
        </div>

        {/* My Pharmacy and Customers Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Pharmacy Section */}
          <DashboardSection
            title="My Pharmacy"
            actionText="Go to User Management"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">04</p>
                <p className="text-sm text-slate-600">Total no of Suppliers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">05</p>
                <p className="text-sm text-slate-600">Total no of Users</p>
              </div>
            </div>
          </DashboardSection>

          {/* Customers Section */}
          <DashboardSection title="Customers" actionText="Go to Customers Page">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">845</p>
                <p className="text-sm text-slate-600">Total no of Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  Adalimumab
                </p>
                <p className="text-sm text-slate-600">Frequently bought Item</p>
              </div>
            </div>
          </DashboardSection>
        </div>
      </div>
    </PharmacyShell>
  );
}
