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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Pages</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats Cards (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Users Card */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                      <p className="text-xs text-gray-500">All system users</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-gray-900 mb-2">128</p>
                    <p className="text-sm text-gray-600">All system users</p>
                  </div>
                </div>

                {/* Pet Owners Card */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Pet Owners</p>
                      <p className="text-xs text-gray-500">Active accounts</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-gray-900 mb-2">84</p>
                    <p className="text-sm text-gray-600">Active accounts</p>
                  </div>
                </div>

                {/* Doctors Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Doctors</p>
                      <p className="text-xs text-gray-500">Licensed doctors</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-gray-900 mb-2">12</p>
                    <p className="text-sm text-gray-600">Licensed doctors</p>
                  </div>
                </div>

                {/* Pharmacy & Staff Card */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 border border-rose-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Pharmacy & Staff</p>
                      <p className="text-xs text-gray-500">POS & reception</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-gray-900 mb-2">32</p>
                    <p className="text-sm text-gray-600">POS & reception</p>
                  </div>
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Admin Actions</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Manage system users
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                    Add New User
                  </button>
                  <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                    Assign Roles
                  </button>
                  <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                    View User Activity
                  </button>
                </div>
              </div>

              {/* Recent Users Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Hirusha Subasinghe", role: "Admin", email: "admin@petcore.com", status: "Active" },
                        { name: "Dr. Kavindu Perera", role: "Doctor", email: "kavindu@petcore.com", status: "Active" },
                        { name: "Nimali Fernando", role: "Pharmacy Staff", email: "nimali@petcore.com", status: "Active" },
                        { name: "Ruwanthi Jayasinghe", role: "Pet Owner", email: "ruwanthi@example.com", status: "Pending" },
                      ].map((user, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{user.role}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.status === "Active" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - System Status (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              {/* System Status Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">New registrations</p>
                      <p className="text-xs text-gray-500">(last 7 days)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">+24</p>
                      <p className="text-xs text-green-600">↗ 24</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Blocked accounts</p>
                      <p className="text-xs text-gray-500">&nbsp;</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">2</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last backup</p>
                      <p className="text-xs text-gray-500">&nbsp;</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Today 02:15 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Users Mini List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Users</h2>
                <div className="space-y-4">
                  {[
                    { name: "Hirusha Subasinghe", role: "Admin", email: "admin@petcore.com", status: "Active" },
                    { name: "Dr. Kavindu Perera", role: "Doctor", email: "kavindu@petcore.com", status: "Active" },
                    { name: "Nimali Fernando", role: "Pharmacy Staff", email: "nimali@petcore.com", status: "Active" },
                    { name: "Ruwanthi Jayasinghe", role: "Pet Owner", email: "ruwanthi@example.com", status: "Pending" },
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        user.status === "Active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

