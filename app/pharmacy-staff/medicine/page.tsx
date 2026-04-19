// app/pharmacy-staff/medicine/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type {
  CreateMedicineRequest,
  Medicine,
  UpdateMedicineRequest,
} from "@/types/pharmacy";
import MedicineTable from "@/components/pharmacy-staff/medicine/MedicineTable";
import AddMedicineForm from "@/components/pharmacy-staff/medicine/AddMedicineForm";

export default function PharmacyMedicinePage() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const response = await apiFetch<Medicine[]>("/api/medicines");
      setMedicines(response);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load medicines from database.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedicines();
  }, [loadMedicines]);

  const filteredMedicines = useMemo(() => {
    const lowerSearch = searchQuery.trim().toLowerCase();

    return medicines.filter((medicine) => {
      const matchesSearch =
        !lowerSearch ||
        medicine.name.toLowerCase().includes(lowerSearch) ||
        (medicine.genericName || "").toLowerCase().includes(lowerSearch) ||
        (medicine.form || "").toLowerCase().includes(lowerSearch) ||
        (medicine.strength || "").toLowerCase().includes(lowerSearch) ||
        String(medicine.id).includes(lowerSearch);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? medicine.isActive : !medicine.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [medicines, searchQuery, statusFilter]);

  const handleCreateMedicine = async (payload: CreateMedicineRequest) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      await apiFetch<Medicine>("/api/medicines", {
        method: "POST",
        body: payload,
      });
      setShowAddModal(false);
      await loadMedicines();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to create medicine in database.";
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMedicine = async (payload: UpdateMedicineRequest) => {
    if (!selectedMedicine) return;

    try {
      setIsUpdating(true);
      setUpdateError(null);
      await apiFetch<Medicine>(`/api/medicines/${selectedMedicine.id}`, {
        method: "PUT",
        body: payload,
      });
      setShowEditModal(false);
      setSelectedMedicine(null);
      await loadMedicines();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update medicine in database.";
      setUpdateError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicine) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await apiFetch<{ message: string }>(`/api/medicines/${selectedMedicine.id}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      setSelectedMedicine(null);
      await loadMedicines();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to delete medicine from database.";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["PHARMACIST", "ADMIN"]}>
      <div className="min-h-screen bg-[#f4f6fb] text-[#1a2554]">
        <header className="bg-[#22295f] text-white">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-8 py-4">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="PetCore Logo"
                  width={64}
                  height={64}
                  priority
                />
              </div>

              <nav className="hidden items-center gap-2 text-sm lg:flex">
                <Link
                  className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
                  href="/pharmacy-staff/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="rounded-full border border-white/30 bg-white/5 px-8 py-2 font-medium"
                  href="/pharmacy-staff/medicine"
                >
                  Medicine
                </Link>
                <Link
                  className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
                  href="/pharmacy-staff/inventory"
                >
                  Inventory Management
                </Link>
                <Link
                  className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
                  href="/pharmacy-staff/pos"
                >
                  POS
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <p className="hidden text-base text-white/90 xl:block">{user.email}</p>
              <button
                onClick={logout}
                className="rounded-xl bg-white px-6 py-2 text-sm font-semibold text-[#1f285b] hover:bg-white/90"
              >
                Log out
              </button>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-semibold text-[#1f285b]">
                {user.email?.charAt(0).toUpperCase() || "T"}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-8 pb-10 pt-10">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-[#18214f]">
                Medicine
              </h1>
              <p className="mt-2 flex items-center gap-2 text-2xl text-[#445178]">
                <span>Inventory</span>
                <span className="text-[#6676a8]">&#8250;</span>
                <span className="font-semibold text-[#18214f]">
                  List of Medicines ({filteredMedicines.length})
                </span>
              </p>
            </div>

            <button
              onClick={() => {
                setCreateError(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-3 rounded-2xl bg-[#1f5fe0] px-8 py-4 text-xl font-medium text-white shadow-[0_8px_18px_rgba(31,95,224,0.35)] hover:bg-[#1a54c9]"
            >
              <svg
                className="h-6 w-6"
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
              Add New Item
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by medicine name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] px-6 pr-14 text-xl text-[#273566] placeholder:text-[#6272a3] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#6978ab]">
                <svg
                  className="h-9 w-9"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            <div className="relative min-w-[260px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] pl-6 pr-14 text-xl text-[#273566] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <svg
                className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6877a9]"
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
            </div>
          </div>

          {loadError ? (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
              {loadError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-[#dce2ef] bg-white p-8 text-center text-lg text-[#596892]">
              Loading medicines...
            </div>
          ) : (
            <MedicineTable
              medicines={filteredMedicines}
              onEdit={(medicine) => {
                setSelectedMedicine(medicine);
                setUpdateError(null);
                setShowEditModal(true);
              }}
              onDelete={(medicine) => {
                setSelectedMedicine(medicine);
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
            />
          )}
        </main>

        {showAddModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
              <AddMedicineForm
                onSubmit={handleCreateMedicine}
                onCancel={() => {
                  if (!isCreating) {
                    setShowAddModal(false);
                    setCreateError(null);
                  }
                }}
                isSubmitting={isCreating}
                errorMessage={createError ?? undefined}
                title="Add Medicine"
                submitLabel="Save Medicine"
              />
            </div>
          </div>
        ) : null}

        {showEditModal && selectedMedicine ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
              <AddMedicineForm
                onSubmit={handleUpdateMedicine}
                onCancel={() => {
                  if (!isUpdating) {
                    setShowEditModal(false);
                    setSelectedMedicine(null);
                    setUpdateError(null);
                  }
                }}
                isSubmitting={isUpdating}
                errorMessage={updateError ?? undefined}
                initialValues={selectedMedicine}
                title="Edit Medicine"
                submitLabel="Update Medicine"
              />
            </div>
          </div>
        ) : null}

        {showDeleteModal && selectedMedicine ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-[#18214f]">Delete Medicine</h2>
              <p className="mt-3 text-sm text-[#46557f]">
                Are you sure you want to delete
                <span className="font-semibold"> {selectedMedicine.name}</span>?
              </p>
              <p className="mt-2 text-xs text-[#6a77a1]">
                If this medicine is already linked to prescriptions or stock batches,
                deletion will be blocked.
              </p>

              {deleteError ? (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deleteError}
                </p>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isDeleting) {
                      setShowDeleteModal(false);
                      setSelectedMedicine(null);
                      setDeleteError(null);
                    }
                  }}
                  className="rounded-xl border border-[#d8dfee] px-4 py-2 text-sm font-medium text-[#2b3c72] hover:bg-[#f7f8fc]"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMedicine}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
