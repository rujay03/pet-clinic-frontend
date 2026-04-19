// components/admin/UserDetailsModal.tsx
"use client";

import { useState } from "react";

type EditableRole = "Admin" | "Doctor" | "Pet Owner" | "Pharmacy Staff";
type EditableStatus = "Active" | "Inactive" | "Blocked";

interface User {
  id: number;
  name: string;
  email: string;
  role: EditableRole;
  status: EditableStatus;
  contactNo?: string;
  joinedDate?: string;
}

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onSave: (payload: { name: string; role: EditableRole; status: EditableStatus; contactNo?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function UserDetailsModal({ user, onClose, onSave, onDelete }: UserDetailsModalProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<EditableRole>(user.role);
  const [status, setStatus] = useState<EditableStatus>(user.status);
  const [contactNo, setContactNo] = useState(user.contactNo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      await onSave({ name: name.trim(), role, status, contactNo: contactNo.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;

    try {
      setLoading(true);
      setError(null);
      await onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update role, status, and contact details
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error ? (
            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Joined</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.joinedDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">User ID</p>
              <p className="text-sm font-medium text-gray-900">#{user.id}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as EditableRole)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Pet Owner">Pet Owner</option>
              <option value="Pharmacy Staff">Pharmacy Staff</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as EditableStatus)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              value={contactNo}
              onChange={(event) => setContactNo(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0771234567"
            />
          </div>

          <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
