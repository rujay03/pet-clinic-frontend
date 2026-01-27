// app/admin/dashboard/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminShell userEmail={user.email}>
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 mb-8">Welcome to the admin control panel</p>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Total Users</h3>
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">1,247</p>
              <p className="text-sm text-green-600 mt-2">+18% from last month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Appointments</h3>
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
              <p className="text-3xl font-bold text-slate-900">342</p>
              <p className="text-sm text-slate-600 mt-2">This month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Active Pets</h3>
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">856</p>
              <p className="text-sm text-green-600 mt-2">+7% growth</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Revenue</h3>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">$45.2K</p>
              <p className="text-sm text-green-600 mt-2">+23% from last month</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                User Growth
              </h3>
              <p className="text-sm text-slate-500 mb-6">Last 7 days</p>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 72, 58, 85, 68, 93, 80].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-700 hover:to-purple-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-500 mt-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Appointment Status
              </h3>
              <p className="text-sm text-slate-500 mb-6">Current overview</p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Completed</span>
                    <span className="text-sm font-semibold text-slate-900">
                      234 (68%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Pending</span>
                    <span className="text-sm font-semibold text-slate-900">
                      78 (23%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: "23%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Cancelled</span>
                    <span className="text-sm font-semibold text-slate-900">
                      30 (9%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: "9%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Activity
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      user: "John Doe",
                      action: "Created new appointment",
                      date: "2 hours ago",
                      status: "Success",
                    },
                    {
                      user: "Jane Smith",
                      action: "Updated pet profile",
                      date: "4 hours ago",
                      status: "Success",
                    },
                    {
                      user: "Mike Johnson",
                      action: "Cancelled appointment",
                      date: "6 hours ago",
                      status: "Cancelled",
                    },
                    {
                      user: "Sarah Williams",
                      action: "Registered new pet",
                      date: "1 day ago",
                      status: "Success",
                    },
                    {
                      user: "Tom Brown",
                      action: "Updated contact info",
                      date: "2 days ago",
                      status: "Success",
                    },
                  ].map((activity, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-900">
                        {activity.user}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {activity.action}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {activity.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === "Success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

