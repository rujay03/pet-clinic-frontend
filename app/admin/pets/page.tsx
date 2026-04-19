"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminPetTypeResponse } from "@/types/adminPets";

type PetSpeciesRow = {
  id: number;
  name: string;
  count: number;
  avatarLabel: string;
  accentClass: string;
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", active: false },
  { label: "Manage Users", href: "/admin/users/manage", active: false },
  { label: "Appointments", href: "/admin/appointments", active: false },
  { label: "Pets", href: "/admin/pets", active: true },
];

const ACCENT_CLASSES = [
  "from-[#f6c788] to-[#eaa455]",
  "from-[#f6d088] to-[#e9af5b]",
  "from-[#8ad8d7] to-[#65c6c5]",
  "from-[#90caef] to-[#70b4e0]",
  "from-[#90d2cf] to-[#67bbb7]",
  "from-[#f2c79b] to-[#e8ab72]",
  "from-[#cab3ff] to-[#9f8bf9]",
  "from-[#f8b0cb] to-[#ec87ae]",
];

function toAvatarLabel(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PT";
}

function mapApiRows(items: AdminPetTypeResponse[]): PetSpeciesRow[] {
  return items.map((item, index) => ({
    id: item.id,
    name: item.name,
    count: item.petCount,
    avatarLabel: toAvatarLabel(item.name),
    accentClass: ACCENT_CLASSES[index % ACCENT_CLASSES.length],
  }));
}

const PAGE_SIZE = 6;

export default function AdminPetsPage() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<PetSpeciesRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [speciesModal, setSpeciesModal] = useState<
    | { mode: "add"; row: null }
    | { mode: "edit"; row: PetSpeciesRow }
    | null
  >(null);
  const [speciesNameInput, setSpeciesNameInput] = useState("");
  const [speciesModalError, setSpeciesModalError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PetSpeciesRow | null>(null);

  const closeSpeciesModal = () => {
    setSpeciesModal(null);
    setSpeciesNameInput("");
    setSpeciesModalError(null);
  };

  const openAddSpeciesModal = () => {
    setActionError(null);
    setSpeciesNameInput("");
    setSpeciesModalError(null);
    setSpeciesModal({ mode: "add", row: null });
  };

  const openEditSpeciesModal = (row: PetSpeciesRow) => {
    setActionError(null);
    setSpeciesNameInput(row.name);
    setSpeciesModalError(null);
    setSpeciesModal({ mode: "edit", row });
  };

  const loadPetTypes = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const response = await apiFetch<AdminPetTypeResponse[]>("/api/admin/pets/species");
      setRows(mapApiRows(response));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to load pet species.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    void loadPetTypes();
  }, [user]);

  const filteredRows = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(normalized));
  }, [searchQuery, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE);

  const handleAddPetType = async () => {
    openAddSpeciesModal();
  };

  const handleSpeciesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!speciesModal) return;

    const normalizedName = speciesNameInput.trim();
    if (!normalizedName) {
      setSpeciesModalError("Species name is required.");
      return;
    }

    const isDuplicate = rows.some((row) => {
      if (speciesModal.mode === "edit" && row.id === speciesModal.row.id) {
        return false;
      }
      return row.name.toLowerCase() === normalizedName.toLowerCase();
    });

    if (isDuplicate) {
      setSpeciesModalError("This species already exists.");
      return;
    }

    setSpeciesModalError(null);
    setActionError(null);

    try {
      if (speciesModal.mode === "add") {
        setIsCreating(true);
        await apiFetch<AdminPetTypeResponse>("/api/admin/pets/species", {
          method: "POST",
          body: { name: normalizedName },
        });
      } else {
        if (normalizedName === speciesModal.row.name) {
          closeSpeciesModal();
          return;
        }
        setProcessingId(speciesModal.row.id);
        await apiFetch<AdminPetTypeResponse>(`/api/admin/pets/species/${speciesModal.row.id}`, {
          method: "PUT",
          body: { name: normalizedName },
        });
      }

      closeSpeciesModal();
      await loadPetTypes();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to save pet species.";
      setSpeciesModalError(message);
    } finally {
      setIsCreating(false);
      setProcessingId(null);
    }
  };

  const handleEditPetType = async (row: PetSpeciesRow) => {
    openEditSpeciesModal(row);
  };

  const handleDeletePetType = async (row: PetSpeciesRow) => {
    setActionError(null);
    setDeleteTarget(row);
  };

  const confirmDeletePetType = async () => {
    if (!deleteTarget) return;

    try {
      setProcessingId(deleteTarget.id);
      await apiFetch<void>(`/api/admin/pets/species/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await loadPetTypes();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to delete pet species.";
      setActionError(message);
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f6f2fc] text-[#23285e]">
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

        <main className="mx-auto w-full max-w-[1180px] px-4 pb-10 pt-10 lg:px-8">
          <h1 className="text-5xl font-semibold leading-none text-[#1f2458]">Pets</h1>
          <p className="mt-5 text-xl text-[#4f5881]">Manage different pet species</p>

          <section className="mt-8 rounded-2xl border border-[#e6e2ef] bg-[#faf8fd] p-4 shadow-[0_2px_14px_rgba(36,42,96,0.05)] md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-[520px] rounded-xl border border-[#ddd8eb] bg-[#f8f6fb] pl-12 pr-4">
                <div className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-[#7681ab]">
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
                  placeholder="Search pet species ..."
                  className="h-12 w-full bg-transparent text-base text-[#303968] placeholder:text-[#8d97bd] focus:outline-none"
                />
              </div>

              <button
                onClick={handleAddPetType}
                disabled={isCreating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5f4cf4] to-[#5e45eb] px-6 py-3 text-base font-medium text-white shadow-[0_10px_18px_rgba(84,74,214,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="text-2xl leading-none">+</span>
                {isCreating ? "Adding..." : "Add Pet Species"}
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#e3deef] bg-white">
              <div className="border-b border-[#ebe6f2] bg-[#f6f3fb] px-6 py-4">
                <h2 className="text-2xl font-semibold text-[#252e66]">Pet Types (Species)</h2>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#ece8f4] bg-[#f8f5fc] text-left text-lg text-[#2d3567]">
                    <th className="px-6 py-4 font-semibold">Pet Type</th>
                    <th className="px-6 py-4 font-semibold">Number of Pets</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-base text-[#7d88af]">
                        Loading pet species...
                      </td>
                    </tr>
                  ) : loadError ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-base text-[#c34966]">
                        {loadError}
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((species) => (
                      <tr key={species.id} className="border-b border-[#f0edf5] text-[#2a3367] last:border-b-0">
                        <td className="px-6 py-4 text-lg">
                          <div className="flex items-center gap-4">
                            <div
                              className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-[#1e2a58] ${species.accentClass}`}
                              aria-hidden="true"
                            >
                              <span>{species.avatarLabel}</span>
                            </div>
                            <span className="text-2xl">{species.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xl">{species.count}</td>
                        <td className="px-6 py-4 text-right text-xl">
                          <button
                            onClick={() => handleEditPetType(species)}
                            disabled={processingId === species.id}
                            className="text-[#5869d8] transition hover:text-[#4155cf] disabled:cursor-not-allowed disabled:text-[#aab4e6]"
                          >
                            Edit
                          </button>
                          <span className="mx-4 text-[#d7d2e5]">|</span>
                          <button
                            onClick={() => handleDeletePetType(species)}
                            disabled={processingId === species.id}
                            className="text-[#e17287] transition hover:text-[#d85d73] disabled:cursor-not-allowed disabled:text-[#efb3bf]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoading && !loadError && visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-base text-[#7d88af]">
                        No pet species found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <div className="flex flex-col items-center justify-between gap-4 border-t border-[#ece8f4] px-6 py-4 text-[#5f6998] md:flex-row">
                <p className="text-base">
                  Showing {visibleRows.length} of {filteredRows.length} pet types
                </p>
                <div className="flex items-center gap-3 text-base">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:text-[#b7bfd8]"
                  >
                    <span aria-hidden="true">&lt;</span>
                    Previous
                  </button>
                  <span className="grid h-9 w-11 place-items-center rounded-xl border border-[#d7d3e8] bg-[#f3f1fb] text-[#3a4686]">
                    {safeCurrentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:text-[#b7bfd8]"
                  >
                    Next
                    <span aria-hidden="true">&gt;</span>
                  </button>
                </div>
              </div>
            </div>

            {actionError ? (
              <div className="mt-4 rounded-xl border border-[#f3c8d1] bg-[#fff2f5] px-4 py-3 text-sm text-[#b14560]">
                {actionError}
              </div>
            ) : null}
          </section>
        </main>
      </div>

      {speciesModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-xl font-semibold text-[#1f2458]">
                  {speciesModal.mode === "add" ? "Add Pet Species" : "Edit Pet Species"}
                </h2>
                <p className="mt-1 text-sm text-[#5f6998]">
                  {speciesModal.mode === "add"
                    ? "Enter a clear, common species name."
                    : "Update the species name shown in the list."}
                </p>
              </div>
              <button
                onClick={closeSpeciesModal}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSpeciesSubmit} className="space-y-4 p-5">
              <div>
                <label htmlFor="speciesNameInput" className="mb-2 block text-sm font-medium text-gray-700">
                  Species Name
                </label>
                <input
                  id="speciesNameInput"
                  value={speciesNameInput}
                  onChange={(event) => setSpeciesNameInput(event.target.value)}
                  autoFocus
                  maxLength={60}
                  placeholder="e.g., Dog, Cat, Rabbit"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base text-[#2a3367] placeholder:text-[#9aa3c5] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5f4cf4]"
                />
              </div>

              {speciesModalError ? (
                <div className="rounded-lg border border-[#f3c8d1] bg-[#fff2f5] px-3 py-2 text-sm text-[#b14560]">
                  {speciesModalError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSpeciesModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || (speciesModal.mode === "edit" && processingId === speciesModal.row.id)}
                  className="rounded-lg bg-[#5f4cf4] px-4 py-2 font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {speciesModal.mode === "add"
                    ? isCreating
                      ? "Saving..."
                      : "Save Species"
                    : processingId === speciesModal.row.id
                      ? "Updating..."
                      : "Update Species"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-xl font-semibold text-[#1f2458]">Delete Pet Species</h2>
            <p className="mt-2 text-sm text-[#5f6998]">
              Are you sure you want to delete <span className="font-semibold text-[#2a3367]">{deleteTarget.name}</span>?
            </p>
            <p className="mt-1 text-xs text-[#8a92b2]">This action cannot be undone.</p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePetType}
                disabled={processingId === deleteTarget.id}
                className="rounded-lg bg-[#d94f6a] px-4 py-2 font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {processingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ProtectedRoute>
  );
}

