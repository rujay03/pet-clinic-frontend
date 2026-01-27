// app/pharmacy-staff/inventory/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { InventoryMedicine } from "@/types/pharmacy";
import PharmacyShell from "@/components/pharmacy-staff/PharmacyShell";
import InventoryTable from "@/components/pharmacy-staff/inventory/InventoryTable";

export default function InventoryManagementPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock inventory data
  const mockInventory: InventoryMedicine[] = [
    {
      id: "1",
      name: "Augmentin 625 Duo Tablet",
      medicineId: "D06ID232435454",
      groupName: "Generic Medicine",
      stockQuantity: 350,
    },
    {
      id: "2",
      name: "Azithral 500 Tablet",
      medicineId: "D06ID232435451",
      groupName: "Generic Medicine",
      stockQuantity: 20,
    },
    {
      id: "3",
      name: "Ascoril LS Syrup",
      medicineId: "D06ID232435452",
      groupName: "Diabetes",
      stockQuantity: 85,
    },
    {
      id: "4",
      name: "Azee 500 Tablet",
      medicineId: "D06ID232435450",
      groupName: "Generic Medicine",
      stockQuantity: 75,
    },
    {
      id: "5",
      name: "Allegra 120mg Tablet",
      medicineId: "D06ID232435455",
      groupName: "Diabetes",
      stockQuantity: 44,
    },
    {
      id: "6",
      name: "Alex Syrup",
      medicineId: "D06ID232435456",
      groupName: "Generic Medicine",
      stockQuantity: 65,
    },
    {
      id: "7",
      name: "Amoxyclav 625 Tablet",
      medicineId: "D06ID232435457",
      groupName: "Generic Medicine",
      stockQuantity: 150,
    },
    {
      id: "8",
      name: "Avil 25 Tablet",
      medicineId: "D06ID232435458",
      groupName: "Generic Medicine",
      stockQuantity: 270,
    },
  ];

  const totalItems = 298;
  const itemsPerPage = 8;

  const handleViewDetail = (medicineId: string) => {
    console.log("View detail for medicine:", medicineId);
    // TODO: Navigate to detail page or open modal
  };

  if (!user) {
    return null;
  }

  const filteredInventory = mockInventory.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || medicine.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <ProtectedRoute allowedRoles={["PHARMACIST", "ADMIN"]}>
      <PharmacyShell userEmail={user.email} onLogout={logout}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Inventory</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-slate-900 font-semibold">
                  Medicine Inventory
                </span>
              </div>
              <p className="text-sm text-slate-500">
                List of medicines available for sales.
              </p>
            </div>
            <button
              onClick={() => router.push("/pharmacy-staff/medicine/add")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              Add New Item
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search Medicine Inventory.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-slate-400"
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
              </button>
            </div>

            {/* Filter Icon */}
            <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {/* Group Filter Dropdown */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-600 cursor-pointer appearance-none min-w-[200px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">- Select Group -</option>
              <option value="Generic Medicine">Generic Medicine</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Pain Relief">Pain Relief</option>
            </select>
          </div>

          {/* Inventory Table */}
          <InventoryTable
            medicines={filteredInventory}
            onViewDetail={handleViewDetail}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-600">
              Showing {startItem} - {endItem} results of {totalItems}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      Page {String(page).padStart(2, "0")}
                    </option>
                  ),
                )}
              </select>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </PharmacyShell>
    </ProtectedRoute>
  );
}
