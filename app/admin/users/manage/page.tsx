// app/admin/users/manage/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import AddUserModal from "@/components/admin/AddUserModal";
import UserDetailsModal from "@/components/admin/UserDetailsModal";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Blocked";
  contactNo?: string;
  joinedDate?: string;
}

// Mock data - replace with API call later
const mockUsers: User[] = [
  { id: 1, name: "Hirusha Subasinghe", email: "admin@petcore.com", role: "Admin", status: "Active", contactNo: "0771234567", joinedDate: "2024-01-15" },
  { id: 2, name: "Dr. Kavindu Perera", email: "kavindu@petcore.com", role: "Doctor", status: "Active", contactNo: "0772345678", joinedDate: "2024-02-20" },
  { id: 3, name: "Nimali Fernando", email: "nimali@petcore.com", role: "Pharmacy Staff", status: "Active", contactNo: "0773456789", joinedDate: "2024-03-10" },
  { id: 4, name: "Ruwanthi Jayasinghe", email: "ruwanthi@example.com", role: "Pet Owner", status: "Pending", contactNo: "0774567890", joinedDate: "2024-04-05" },
  { id: 5, name: "Saman Kumara", email: "saman@petcore.com", role: "Doctor", status: "Active", contactNo: "0775678901", joinedDate: "2024-01-20" },
  { id: 6, name: "Kasuni Silva", email: "kasuni@example.com", role: "Pet Owner", status: "Active", contactNo: "0776789012", joinedDate: "2024-02-15" },
  { id: 7, name: "Pradeep Wickramasinghe", email: "pradeep@petcore.com", role: "Pharmacy Staff", status: "Active", contactNo: "0777890123", joinedDate: "2024-03-25" },
  { id: 8, name: "Chamari Perera", email: "chamari@example.com", role: "Pet Owner", status: "Blocked", contactNo: "0778901234", joinedDate: "2024-04-01" },
];

export default function ManageUsersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  if (!user) {
    return null;
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (newUser: Omit<User, "id" | "joinedDate">) => {
    const user: User = {
      ...newUser,
      id: users.length + 1,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, user]);
    setShowAddModal(false);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminShell userEmail={user.email}>
        <div className="max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Pages</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Manage Users</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

          {/* Search Bar and Add User Button */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Add User Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.contactNo || "No contact"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddUser}
          />
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AdminShell>
    </ProtectedRoute>
  );
}

