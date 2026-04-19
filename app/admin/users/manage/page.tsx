// app/admin/users/manage/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AddUserModal from "@/components/admin/AddUserModal";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  AdminUserResponse,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from "@/types/adminUsers";

type UserStatus = "Active" | "Inactive" | "Blocked";
type UserRole = "Admin" | "Doctor" | "Pet Owner" | "Pharmacy Staff";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  contactNo?: string;
  joinedDate?: string;
}

type SortKey = "name" | "email" | "role" | "status";
type SortDirection = "asc" | "desc";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", active: false },
  { label: "Manage Users", href: "/admin/users/manage", active: true },
  { label: "Appointments", href: "/admin/appointments", active: false },
  { label: "Pets", href: "/admin/pets", active: false },
];

const ROLE_TABS: Array<{ label: string; value: "ALL" | UserRole }> = [
  { label: "All", value: "ALL" },
  { label: "Admins", value: "Admin" },
  { label: "Doctors", value: "Doctor" },
  { label: "Pet Owners", value: "Pet Owner" },
  { label: "Pharmacy & Staff", value: "Pharmacy Staff" },
];

const PAGE_SIZE = 5;

const rolePillClass: Record<UserRole, string> = {
  Admin: "bg-[#e5e7ff] text-[#3f4ea8]",
  Doctor: "bg-[#e5e7ff] text-[#3f4ea8]",
  "Pet Owner": "bg-[#e5e7ff] text-[#3f4ea8]",
  "Pharmacy Staff": "bg-[#f3e9fa] text-[#7c3a90]",
};

const statusPillClass: Record<UserStatus, string> = {
  Active: "bg-[#d2f0e7] text-[#257767]",
  Inactive: "bg-[#e9ebf4] text-[#525f8b]",
  Blocked: "bg-[#fad9df] text-[#a6334b]",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarClass(role: UserRole) {
  if (role === "Admin") return "bg-gradient-to-br from-[#9566ff] to-[#6d5dee] text-white";
  if (role === "Doctor") return "bg-gradient-to-br from-[#5e87ff] to-[#5e7be0] text-white";
  return "bg-gradient-to-br from-[#b4e2d9] to-[#86cfc2] text-[#3f6f69]";
}

function getSortValue(user: User, key: SortKey) {
  return user[key].toLowerCase();
}

function roleFromApi(role: string): UserRole {
  const normalized = role.toUpperCase();
  if (normalized === "ADMIN") return "Admin";
  if (normalized === "DOCTOR") return "Doctor";
  if (normalized === "PHARMACIST") return "Pharmacy Staff";
  return "Pet Owner";
}

function statusFromApi(status: string): UserStatus {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "Active";
  if (normalized === "INACTIVE") return "Inactive";
  return "Blocked";
}

function roleToApi(role: UserRole): UpdateAdminUserRequest["role"] {
  if (role === "Admin") return "ADMIN";
  if (role === "Doctor") return "DOCTOR";
  if (role === "Pharmacy Staff") return "PHARMACIST";
  return "PETOWNER";
}

function statusToApi(status: UserStatus): UpdateAdminUserRequest["status"] {
  if (status === "Active") return "ACTIVE";
  if (status === "Inactive") return "INACTIVE";
  return "SUSPENDED";
}

function mapApiUser(item: AdminUserResponse): User {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    role: roleFromApi(item.role),
    status: statusFromApi(item.status),
    contactNo: item.contactNo ?? undefined,
    joinedDate: item.joinedDate ?? undefined,
  };
}

export default function ManageUsersPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleTab, setActiveRoleTab] = useState<"ALL" | UserRole>("ALL");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoadingUsers(false);
      return;
    }

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setLoadError(null);
        const response = await apiFetch<AdminUserResponse[]>("/api/admin/users");
        setUsers(response.map(mapApiUser));
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Failed to load users";
        setLoadError(message);
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, [user]);

  const roleCounts = useMemo(
    () => ({
      ALL: users.length,
      Admin: users.filter((item) => item.role === "Admin").length,
      Doctor: users.filter((item) => item.role === "Doctor").length,
      "Pet Owner": users.filter((item) => item.role === "Pet Owner").length,
      "Pharmacy Staff": users.filter((item) => item.role === "Pharmacy Staff").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query);

        const matchesTab = activeRoleTab === "ALL" || item.role === activeRoleTab;

        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sortKey);
        const bValue = getSortValue(b, sortKey);

        if (aValue === bValue) return 0;
        if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
        return aValue > bValue ? -1 : 1;
      });
  }, [users, searchQuery, activeRoleTab, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(pageStart, pageStart + PAGE_SIZE);

  const allVisibleSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((currentUser) => selectedIds.includes(currentUser.id));

  const handleSort = (key: SortKey) => {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleUpdateUser = async (target: User, payload: { name: string; role: UserRole; status: UserStatus; contactNo?: string }) => {
    const request: UpdateAdminUserRequest = {
      name: payload.name,
      role: roleToApi(payload.role),
      status: statusToApi(payload.status),
      contactNo: payload.contactNo?.trim() || undefined,
    };

    const updated = await apiFetch<AdminUserResponse>(`/api/admin/users/${target.id}`, {
      method: "PUT",
      body: request,
    });

    const mapped = mapApiUser(updated);
    setUsers((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
    setSelectedUser(mapped);
  };

  const handleDeleteUser = async (target: User) => {
    await apiFetch<void>(`/api/admin/users/${target.id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((item) => item.id !== target.id));
    setSelectedIds((prev) => prev.filter((id) => id !== target.id));
    setSelectedUser(null);
  };

  const handleAddUser = async (payload: CreateAdminUserRequest) => {
    const created = await apiFetch<AdminUserResponse>("/api/admin/users", {
      method: "POST",
      body: payload,
    });

    const mapped = mapApiUser(created);
    setUsers((prev) => [mapped, ...prev]);
    setCurrentPage(1);
  };

  const showingText =
    filteredUsers.length === 0
      ? "Showing 0 of 0 users"
      : `Showing ${pageStart + 1}-${Math.min(pageStart + PAGE_SIZE, filteredUsers.length)} of ${filteredUsers.length} users`;

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f5f4fb] text-[#1f2a59]">
        <header className="bg-gradient-to-r from-[#2a2f79] to-[#2b347f] text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-5 py-4 xl:px-8">
            <div className="flex items-center gap-6 xl:gap-10">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white/95">
                  <Image src="/logo.png" alt="PetCore logo" width={36} height={36} className="h-9 w-9 object-contain" priority />
                </div>
                <span className="text-lg font-semibold leading-none tracking-tight">PetCore</span>
              </div>

              <nav className="hidden items-center gap-2 md:flex lg:gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-4 py-2 text-xs transition-colors ${
                      item.active
                        ? "bg-white/10 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18a2 2 0 01-.58 1.4L4 17h5m6 0a3 3 0 11-6 0" />
                </svg>
              </button>
              <button
                onClick={logout}
                className="rounded-xl border border-white/30 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Logout
              </button>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-[#4b58ae]">
                {user.email[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1300px] px-5 pb-10 pt-10 xl:px-8">
          <h1 className="text-3xl font-semibold leading-[1.1] text-[#1f295a]">Manage Users</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-[#99a5cb]">
            <span className="text-lg text-[#7f8bb3]">Admin Panel</span>
            <span className="text-base">&gt;</span>
            <span className="text-lg text-[#2f3b71]">Manage Users</span>
          </div>

          {loadError ? <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div> : null}

          <section className="mt-8 rounded-3xl border border-[#d9dced] bg-white/65 shadow-[0_2px_8px_rgba(37,54,112,0.03)]">
            <div className="border-b border-[#e6e8f2] p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex w-fit items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f67ff] to-[#2258f0] px-7 py-3 text-base font-medium text-white shadow-sm transition hover:brightness-105"
                >
                  <span className="text-2xl leading-none">+</span>
                  Add New User
                </button>

                <div className="relative min-w-[320px] rounded-xl border border-[#d6d9e8] bg-[#f9faff] pl-12 pr-4">
                  <div className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-[#7884af]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search users..."
                    className="h-12 w-full bg-transparent text-base text-[#2b376f] placeholder:text-[#8e98bd] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {ROLE_TABS.map((tab) => {
                  const isActive = activeRoleTab === tab.value;
                  const count = tab.value === "ALL" ? roleCounts.ALL : roleCounts[tab.value];
                  return (
                    <button
                      key={tab.label}
                      onClick={() => {
                        setActiveRoleTab(tab.value);
                        setCurrentPage(1);
                      }}
                      className={`rounded-xl border px-6 py-2.5 text-sm transition md:text-base ${
                        isActive
                          ? "border-[#c5d2ff] bg-[#e9edff] text-[#245ef6]"
                          : "border-[#d8dceb] bg-white text-[#5a6798] hover:bg-[#f5f7ff]"
                      }`}
                    >
                      {tab.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-[#e6e8f2] px-6 py-4">
              <div className="flex items-center gap-3 text-[#6674a4]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l-7 7 7 7M19 5l-7 7 7 7" />
                </svg>
                <p className="text-sm">Showing {filteredUsers.length} of {users.length} users</p>
              </div>
            </div>

            <div className="p-5 lg:p-6">
              <div className="overflow-hidden rounded-2xl border border-[#e0e4f0] bg-white">
                <div className="grid grid-cols-[56px_1.5fr_1.2fr_0.9fr_0.9fr_0.9fr] items-center bg-gradient-to-b from-[#f7f8fe] to-[#f3f5fb] px-5 py-4 text-sm text-[#2f3a70] lg:text-base">
                  <label className="grid place-items-center">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() => {
                        const visibleIds = paginatedUsers.map((currentUser) => currentUser.id);
                        if (allVisibleSelected) {
                          setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
                        } else {
                          setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
                        }
                      }}
                      className="h-6 w-6 rounded border-[#ccd3e9] text-[#4368ff] focus:ring-[#9eb2ff]"
                    />
                  </label>
                  <button onClick={() => handleSort("name")} className="flex items-center gap-2 font-medium">
                    Name
                  </button>
                  <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium">
                    Email
                  </button>
                  <button onClick={() => handleSort("role")} className="flex items-center gap-2 font-medium">
                    Role
                  </button>
                  <button onClick={() => handleSort("status")} className="flex items-center gap-2 font-medium">
                    Status
                  </button>
                  <p className="font-medium">Action</p>
                </div>

                {loadingUsers ? (
                  <div className="py-16 text-center text-lg text-[#7a86ae]">Loading users...</div>
                ) : paginatedUsers.length === 0 ? (
                  <div className="py-16 text-center text-lg text-[#7a86ae]">No users found for the selected filters.</div>
                ) : (
                  paginatedUsers.map((currentUser) => (
                    <div key={currentUser.id} className="grid grid-cols-[56px_1.5fr_1.2fr_0.9fr_0.9fr_0.9fr] items-center border-t border-[#eceff7] px-5 py-4">
                      <label className="grid place-items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(currentUser.id)}
                          onChange={() => setSelectedIds((prev) => (prev.includes(currentUser.id) ? prev.filter((id) => id !== currentUser.id) : [...prev, currentUser.id]))}
                          className="h-6 w-6 rounded border-[#ccd3e9] text-[#4368ff] focus:ring-[#9eb2ff]"
                        />
                      </label>

                      <div className="flex items-center gap-3">
                        <div className={`grid h-14 w-14 place-items-center rounded-full text-xl font-medium ${getAvatarClass(currentUser.role)}`}>
                          {getInitials(currentUser.name)}
                        </div>
                        <div>
                          <p className="text-lg leading-tight text-[#1f295a]">{currentUser.name}</p>
                          <p className="text-sm text-[#6673a3]">{currentUser.email}</p>
                        </div>
                      </div>

                      <p className="text-base text-[#4a588b]">{currentUser.email}</p>

                      <span className={`inline-flex w-fit rounded-xl px-4 py-1.5 text-sm ${rolePillClass[currentUser.role]}`}>
                        {currentUser.role}
                      </span>

                      <span className={`inline-flex w-fit rounded-xl px-4 py-1.5 text-sm ${statusPillClass[currentUser.status]}`}>
                        {currentUser.status}
                      </span>

                      <button
                        onClick={() => setSelectedUser(currentUser)}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#ccd3e9] px-6 py-2 text-base text-[#4f5d8f] hover:bg-[#f8f9ff]"
                      >
                        Edit
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 px-2">
                <p className="text-sm text-[#5f6da0]">{showingText}</p>
              </div>
            </div>
          </section>
        </main>

        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={(payload) => handleUpdateUser(selectedUser, payload)}
            onDelete={() => handleDeleteUser(selectedUser)}
          />
        )}

        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddUser}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
