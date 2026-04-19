// app/pharmacy-staff/inventory/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type {
  InventoryMedicine,
  InventoryMedicineApi,
  UpdateMedicineRequest,
} from "@/types/pharmacy";
import InventoryTable from "@/components/pharmacy-staff/inventory/InventoryTable";

type SortKey = "name" | "medicineId" | "groupName" | "stockQuantity";
type SortDirection = "asc" | "desc";
type StockFilter = "all" | "in" | "low" | "out";

export default function InventoryManagementPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [addBatchError, setAddBatchError] = useState<string | null>(null);
  const [addBatchForm, setAddBatchForm] = useState({
    medicineId: "",
    batchNo: "",
    expiryDate: "",
    purchasePrice: "",
    unitSellPrice: "",
    quantity: "",
    receivedAt: "",
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<InventoryMedicine | null>(null);
  const [editForm, setEditForm] = useState({
    groupName: "",
    stockQuantity: "0",
  });
  const [isUpdatingMedicine, setIsUpdatingMedicine] = useState(false);
  const [isDeletingMedicine, setIsDeletingMedicine] = useState(false);

  const mapInventoryFromApi = useCallback((item: InventoryMedicineApi): InventoryMedicine => {
    const inferredGroup = item.form || item.genericName || "General";

    return {
      id: String(item.medicineId),
      name: item.medicineName,
      medicineId: String(item.medicineId),
      groupName: inferredGroup,
      stockQuantity: item.availableQuantity ?? 0,
      genericName: item.genericName,
      form: item.form,
      strength: item.strength,
      active: item.active,
      unitSellPrice: item.unitSellPrice,
      reorderLevel: 40,
    };
  }, []);

  const loadInventory = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);
      const response = await apiFetch<InventoryMedicineApi[]>("/api/inventory");
      setInventory(response.map(mapInventoryFromApi));
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load inventory from database.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [mapInventoryFromApi, user]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const totalItems = inventory.length;

  const lowStockCount = inventory.filter(
    (item) => item.stockQuantity > 0 && item.stockQuantity <= (item.reorderLevel ?? 40),
  ).length;
  const outOfStockCount = inventory.filter((item) => item.stockQuantity <= 0).length;

  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter((medicine) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        medicine.name.toLowerCase().includes(search) ||
        medicine.medicineId.toLowerCase().includes(search);
      const matchesGroup = !selectedGroup || medicine.groupName === selectedGroup;

      const reorderLevel = medicine.reorderLevel ?? 40;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" && medicine.stockQuantity > reorderLevel) ||
        (stockFilter === "low" &&
          medicine.stockQuantity > 0 &&
          medicine.stockQuantity <= reorderLevel) ||
        (stockFilter === "out" && medicine.stockQuantity <= 0);

      return matchesSearch && matchesGroup && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const first = String(aValue).toLowerCase();
      const second = String(bValue).toLowerCase();
      const compare = first.localeCompare(second);
      return sortDirection === "asc" ? compare : -compare;
    });
  }, [inventory, searchQuery, selectedGroup, stockFilter, sortKey, sortDirection]);

  const groupOptions = useMemo(() => {
    return [...new Set(inventory.map((item) => item.groupName).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [inventory]);

  const medicineOptions = useMemo(() => {
    return [...inventory].sort((a, b) => a.name.localeCompare(b.name));
  }, [inventory]);

  if (!user) {
    return null;
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleView = (medicineId: string) => {
    const medicine = inventory.find((item) => item.id === medicineId);
    if (!medicine) return;
    setSelectedMedicine(medicine);
    setShowViewModal(true);
  };

  const handleEditOpen = (medicineId: string) => {
    const medicine = inventory.find((item) => item.id === medicineId);
    if (!medicine) return;

    setSelectedMedicine(medicine);
    setEditForm({
      groupName: medicine.groupName,
      stockQuantity: String(medicine.stockQuantity),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMedicine) return;

    const nextStock = Number(editForm.stockQuantity);
    if (!Number.isFinite(nextStock) || nextStock < 0) {
      setLoadError("Stock in qty must be zero or greater.");
      return;
    }

    try {
      setIsUpdatingMedicine(true);
      setLoadError(null);

      // Persist group name by mapping it to medicine form.
      await apiFetch(`/api/medicines/${selectedMedicine.id}`, {
        method: "PUT",
        body: {
          name: selectedMedicine.name,
          genericName: selectedMedicine.genericName || undefined,
          form: editForm.groupName || undefined,
          strength: selectedMedicine.strength || undefined,
          isActive: selectedMedicine.active ?? true,
        } satisfies UpdateMedicineRequest,
      });

      const currentStock = selectedMedicine.stockQuantity;
      const delta = nextStock - currentStock;

      if (delta > 0) {
        await apiFetch("/api/inventory/batches", {
          method: "POST",
          body: {
            medicineId: Number(selectedMedicine.id),
            batchNo: `ADJ-${Date.now()}`,
            purchasePrice: 0,
            quantity: delta,
            unitSellPrice: selectedMedicine.unitSellPrice ?? 0,
          },
        });
      } else if (delta < 0) {
        await apiFetch("/api/inventory/sales", {
          method: "POST",
          body: {
            medicineId: Number(selectedMedicine.id),
            quantity: Math.abs(delta),
          },
        });
      }

      setShowEditModal(false);
      setSelectedMedicine(null);
      await loadInventory();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to update inventory item.";
      setLoadError(message);
    } finally {
      setIsUpdatingMedicine(false);
    }
  };

  const handleDelete = async (medicineId: string) => {
    const medicine = inventory.find((item) => item.id === medicineId);
    if (!medicine) return;

    const confirmed = window.confirm(`Delete medicine \"${medicine.name}\"?`);
    if (!confirmed) return;

    try {
      setIsDeletingMedicine(true);
      setLoadError(null);
      await apiFetch(`/api/medicines/${medicine.id}`, {
        method: "DELETE",
      });
      await loadInventory();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to delete medicine.";
      setLoadError(message);
    } finally {
      setIsDeletingMedicine(false);
    }
  };

  const handleOpenAddBatchModal = () => {
    const firstMedicineId = medicineOptions[0]?.id ?? "";
    setAddBatchError(null);
    setAddBatchForm({
      medicineId: firstMedicineId,
      batchNo: "",
      expiryDate: "",
      purchasePrice: "",
      unitSellPrice: "",
      quantity: "",
      receivedAt: "",
    });
    setShowAddBatchModal(true);
  };

  const handleAddBatchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !addBatchForm.medicineId ||
      !addBatchForm.batchNo.trim() ||
      !addBatchForm.quantity ||
      !addBatchForm.unitSellPrice
    ) {
      setAddBatchError("Medicine, batch number, quantity, and unit sell price are required.");
      return;
    }

    const quantity = Number(addBatchForm.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) {
      setAddBatchError("Quantity must be at least 1.");
      return;
    }

    const payload: {
      medicineId: number;
      batchNo: string;
      quantity: number;
      expiryDate?: string;
      purchasePrice: number;
      unitSellPrice?: number;
      receivedAt?: string;
    } = {
      medicineId: Number(addBatchForm.medicineId),
      batchNo: addBatchForm.batchNo.trim(),
      quantity,
      purchasePrice: addBatchForm.purchasePrice ? Number(addBatchForm.purchasePrice) : 0,
    };

    if (addBatchForm.expiryDate) {
      payload.expiryDate = addBatchForm.expiryDate;
    }
    if (addBatchForm.unitSellPrice) {
      payload.unitSellPrice = Number(addBatchForm.unitSellPrice);
    }
    if (addBatchForm.receivedAt) {
      payload.receivedAt = addBatchForm.receivedAt;
    }

    try {
      setIsAddingBatch(true);
      setAddBatchError(null);
      await apiFetch("/api/inventory/batches", {
        method: "POST",
        body: payload,
      });
      setShowAddBatchModal(false);
      await loadInventory();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to add inventory batch.";
      setAddBatchError(message);
    } finally {
      setIsAddingBatch(false);
    }
  };

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
                  className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
                  href="/pharmacy-staff/medicine"
                >
                  Medicine
                </Link>
                <Link
                  className="rounded-full border border-white/30 bg-white/5 px-8 py-2 font-medium"
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
                Inventory Management
              </h1>
              <p className="mt-2 flex items-center gap-2 text-2xl text-[#445178]">
                <span>Inventory</span>
                <span className="text-[#6676a8]">&#8250;</span>
                <span className="font-semibold text-[#18214f]">Medicine Inventory</span>
              </p>
            </div>

            <button
              onClick={handleOpenAddBatchModal}
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
              Add Inventory
            </button>
          </div>

          <div className="mb-4 flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setStockFilter("all")}
              className={`rounded-full px-4 py-1.5 font-medium ${
                stockFilter === "all" ? "bg-[#1f5fe0] text-white" : "bg-white text-[#2b3c72]"
              }`}
            >
              All ({inventory.length})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter("low")}
              className={`rounded-full px-4 py-1.5 font-medium ${
                stockFilter === "low" ? "bg-amber-500 text-white" : "bg-white text-[#2b3c72]"
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter("out")}
              className={`rounded-full px-4 py-1.5 font-medium ${
                stockFilter === "out" ? "bg-red-500 text-white" : "bg-white text-[#2b3c72]"
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
            <span className="ml-auto text-[#55679a]">Total SKUs: {totalItems}</span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Medicine Inventory.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] px-6 pr-14 text-xl text-[#273566] placeholder:text-[#6272a3] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
              />
              <button
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6978ab]"
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
                    strokeWidth={1.8}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStockFilter((prev) => (prev === "low" ? "all" : "low"))}
              className="grid h-14 w-14 place-items-center rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] text-[#48588f]"
              aria-label="Toggle low stock filter"
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
                  strokeWidth={1.8}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            <div className="relative min-w-[300px]">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] pl-6 pr-14 text-xl text-[#273566] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
              >
                <option value="">- Select Group -</option>
                {groupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
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
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-[#dce2ef] bg-white p-8 text-center text-lg text-[#596892]">
              Loading inventory...
            </div>
          ) : (
            <InventoryTable
              medicines={filteredInventory}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              onView={handleView}
              onEdit={handleEditOpen}
              onDelete={handleDelete}
            />
          )}
        </main>

        {showViewModal && selectedMedicine ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-[#18214f]">Medicine Details</h2>
              <div className="mt-4 space-y-2 text-sm text-[#2b3c72]">
                <p><strong>Name:</strong> {selectedMedicine.name}</p>
                <p><strong>Medicine ID:</strong> {selectedMedicine.medicineId}</p>
                <p><strong>Generic:</strong> {selectedMedicine.genericName || "-"}</p>
                <p><strong>Form:</strong> {selectedMedicine.form || "-"}</p>
                <p><strong>Strength:</strong> {selectedMedicine.strength || "-"}</p>
                <p><strong>Stock:</strong> {selectedMedicine.stockQuantity}</p>
                <p><strong>Sell Price:</strong> {selectedMedicine.unitSellPrice ?? "-"}</p>
                <p><strong>Status:</strong> {(selectedMedicine.active ?? true) ? "Active" : "Inactive"}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedMedicine(null);
                  }}
                  className="rounded-lg border border-[#ccd4ea] px-5 py-2 text-[#2d3e74]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showEditModal && selectedMedicine ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <form
              onSubmit={handleEditSubmit}
              className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-[#18214f]">Edit Inventory Item</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm text-[#2b3c72]">
                  Group Name
                  <input
                    type="text"
                    value={editForm.groupName}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, groupName: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    required
                  />
                </label>
                <label className="text-sm text-[#2b3c72]">
                  Stock in Qty
                  <input
                    type="number"
                    min={0}
                    value={editForm.stockQuantity}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, stockQuantity: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    required
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isUpdatingMedicine) {
                      setShowEditModal(false);
                      setSelectedMedicine(null);
                    }
                  }}
                  className="rounded-lg border border-[#ccd4ea] px-5 py-2 text-[#2d3e74]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingMedicine || isDeletingMedicine}
                  className="rounded-lg bg-[#1f5fe0] px-5 py-2 font-medium text-white disabled:opacity-60"
                >
                  {isUpdatingMedicine ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {showAddBatchModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <form
              onSubmit={handleAddBatchSubmit}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-[#18214f]">Add Inventory Batch</h2>
              <p className="mt-1 text-sm text-[#5a6792]">Receive stock for an existing medicine.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm text-[#2b3c72]">
                  Medicine
                  <select
                    value={addBatchForm.medicineId}
                    onChange={(e) =>
                      setAddBatchForm((prev) => ({ ...prev, medicineId: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    required
                    disabled={medicineOptions.length === 0}
                  >
                    {medicineOptions.length === 0 ? (
                      <option value="">No medicines available</option>
                    ) : null}
                    {medicineOptions.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} (ID: {medicine.medicineId})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Batch No
                  <input
                    type="text"
                    value={addBatchForm.batchNo}
                    onChange={(e) => setAddBatchForm((prev) => ({ ...prev, batchNo: e.target.value }))}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    placeholder="B-2026-04"
                    required
                  />
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    value={addBatchForm.quantity}
                    onChange={(e) => setAddBatchForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    required
                  />
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Purchase Price
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={addBatchForm.purchasePrice}
                    onChange={(e) =>
                      setAddBatchForm((prev) => ({ ...prev, purchasePrice: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    placeholder="Optional"
                  />
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Unit Sell Price
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={addBatchForm.unitSellPrice}
                    onChange={(e) =>
                      setAddBatchForm((prev) => ({ ...prev, unitSellPrice: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                    placeholder="Required for POS pricing"
                  />
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Expiry Date
                  <input
                    type="date"
                    value={addBatchForm.expiryDate}
                    onChange={(e) =>
                      setAddBatchForm((prev) => ({ ...prev, expiryDate: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                  />
                </label>

                <label className="text-sm text-[#2b3c72]">
                  Received At
                  <input
                    type="datetime-local"
                    value={addBatchForm.receivedAt}
                    onChange={(e) =>
                      setAddBatchForm((prev) => ({ ...prev, receivedAt: e.target.value }))
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-[#d8dfee] px-3"
                  />
                </label>
              </div>

              {addBatchError ? (
                <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{addBatchError}</div>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isAddingBatch) {
                      setShowAddBatchModal(false);
                      setAddBatchError(null);
                    }
                  }}
                  className="rounded-lg border border-[#ccd4ea] px-5 py-2 text-[#2d3e74]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingBatch || medicineOptions.length === 0}
                  className="rounded-lg bg-[#1f5fe0] px-5 py-2 font-medium text-white disabled:opacity-60"
                >
                  {isAddingBatch ? "Saving..." : "Save Batch"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
       </div>
     </ProtectedRoute>
   );
 }
