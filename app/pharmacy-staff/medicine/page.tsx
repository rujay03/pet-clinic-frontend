// app/pharmacy-staff/medicine/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { Medicine } from "@/types/pharmacy";
import PharmacyShell from "@/components/pharmacy-staff/PharmacyShell";
import MedicineTable from "@/components/pharmacy-staff/medicine/MedicineTable";

export default function PharmacyMedicinePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock medicine data
  const mockMedicines: Medicine[] = [
    {
      id: "1",
      name: "Augmentin 625 Duo Tablet",
      medicineId: "D061D232435454",
      groupName: "Generic Medicine",
    },
    {
      id: "2",
      name: "Azithral 500 Tablet",
      medicineId: "D061D232435451",
      groupName: "Generic Medicine",
    },
    {
      id: "3",
      name: "Ascoril LS Syrup",
      medicineId: "D061D232435452",
      groupName: "Diabetes",
    },
    {
      id: "4",
      name: "Azee 500 Tablet",
      medicineId: "D061D232435450",
      groupName: "Generic Medicine",
    },
    {
      id: "5",
      name: "Allegra 120mg Tablet",
      medicineId: "D061D232435455",
      groupName: "Diabetes",
    },
    {
      id: "6",
      name: "Alex Syrup",
      medicineId: "D061D232435456",
      groupName: "Generic Medicine",
    },
    {
      id: "7",
      name: "Amoxyclav 625 Tablet",
      medicineId: "D061D232435457",
      groupName: "Generic Medicine",
    },
    {
      id: "8",
      name: "Avil 25 Tablet",
      medicineId: "D061D232435458",
      groupName: "Generic Medicine",
    },
  ];

  const totalMedicines = 298;
  const itemsPerPage = 8;

  if (!user) {
    return null;
  }

  const filteredMedicines = mockMedicines.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || medicine.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

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
                List of Medicines ({totalMedicines})
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
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
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

          {/* Group Filter */}
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="">- Select Group -</option>
              <option value="Generic Medicine">Generic Medicine</option>
              <option value="Diabetes">Diabetes</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
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

        {/* Medicine Table */}
        <MedicineTable medicines={filteredMedicines} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-600">
            Showing 1 - {Math.min(itemsPerPage, filteredMedicines.length)}{" "}
            results of {totalMedicines}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium">
              Page {currentPage.toString().padStart(2, "0")}
              <svg
                className="inline-block w-4 h-4 ml-2"
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
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
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
