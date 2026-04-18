// app/pharmacy-staff/inventory/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { InventoryMedicine } from "@/types/pharmacy";
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
  const [inventory, setInventory] = useState<InventoryMedicine[]>([
    {
      id: "1",
      name: "Canine Deworming Tablet",
      medicineId: "VET-ANTP-001",
      groupName: "Antiparasitic",
      stockQuantity: 350,
      reorderLevel: 80,
      lastUpdated: "2h ago",
    },
    {
      id: "2",
      name: "Feline Deworming Suspension",
      medicineId: "VET-ANTP-002",
      groupName: "Antiparasitic",
      stockQuantity: 20,
      reorderLevel: 40,
      lastUpdated: "1d ago",
    },
    {
      id: "3",
      name: "Amoxiclav Vet 250 mg",
      medicineId: "VET-ANTI-003",
      groupName: "Antibiotic",
      stockQuantity: 85,
      reorderLevel: 30,
      lastUpdated: "5h ago",
    },
    {
      id: "4",
      name: "Doxycycline Vet 100 mg",
      medicineId: "VET-ANTI-004",
      groupName: "Antibiotic",
      stockQuantity: 75,
      reorderLevel: 25,
      lastUpdated: "4h ago",
    },
    {
      id: "5",
      name: "Meloxicam Oral Suspension",
      medicineId: "VET-PAIN-005",
      groupName: "Pain Relief",
      stockQuantity: 44,
      reorderLevel: 50,
      lastUpdated: "3h ago",
    },
    {
      id: "6",
      name: "Carprofen Chewable Tablet",
      medicineId: "VET-PAIN-006",
      groupName: "Pain Relief",
      stockQuantity: 65,
      reorderLevel: 30,
      lastUpdated: "8h ago",
    },
    {
      id: "7",
      name: "Pet Multivitamin Syrup",
      medicineId: "VET-SUPP-007",
      groupName: "Supplements",
      stockQuantity: 150,
      reorderLevel: 40,
      lastUpdated: "2d ago",
    },
    {
      id: "8",
      name: "Probiotic Sachet for Pets",
      medicineId: "VET-SUPP-008",
      groupName: "Supplements",
      stockQuantity: 270,
      reorderLevel: 70,
      lastUpdated: "6h ago",
    },
  ]);

  if (!user) {
    return null;
  }

  const totalItems = 298;

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleViewDetail = (medicineId: string) => {
    router.push(`/pharmacy-staff/inventory/${medicineId}`);
  };

  const handleAdjustStock = (medicineId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === medicineId
          ? {
              ...item,
              stockQuantity: Math.max(0, item.stockQuantity + delta),
              lastUpdated: "just now",
            }
          : item,
      ),
    );
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
              onClick={() => router.push("/pharmacy-staff/medicine/add")}
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
                <option value="Antiparasitic">Antiparasitic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Supplements">Supplements</option>
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

          <InventoryTable
            medicines={filteredInventory}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewDetail={handleViewDetail}
            onAdjustStock={handleAdjustStock}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
