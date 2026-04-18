// app/pharmacy-staff/medicine/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { Medicine } from "@/types/pharmacy";
import MedicineTable from "@/components/pharmacy-staff/medicine/MedicineTable";

export default function PharmacyMedicinePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const mockMedicines: Medicine[] = [
    {
      id: "1",
      name: "Canine Deworming Tablet",
      medicineId: "VET-ANTP-001",
      groupName: "Antiparasitic",
    },
    {
      id: "2",
      name: "Feline Deworming Suspension",
      medicineId: "VET-ANTP-002",
      groupName: "Antiparasitic",
    },
    {
      id: "3",
      name: "Amoxiclav Vet 250 mg",
      medicineId: "VET-ANTI-003",
      groupName: "Antibiotic",
    },
    {
      id: "4",
      name: "Doxycycline Vet 100 mg",
      medicineId: "VET-ANTI-004",
      groupName: "Antibiotic",
    },
    {
      id: "5",
      name: "Meloxicam Oral Suspension",
      medicineId: "VET-PAIN-005",
      groupName: "Pain Relief",
    },
    {
      id: "6",
      name: "Carprofen Chewable Tablet",
      medicineId: "VET-PAIN-006",
      groupName: "Pain Relief",
    },
    {
      id: "7",
      name: "Pet Multivitamin Syrup",
      medicineId: "VET-SUPP-007",
      groupName: "Supplements",
    },
    {
      id: "8",
      name: "Probiotic Sachet for Pets",
      medicineId: "VET-SUPP-008",
      groupName: "Supplements",
    },
  ];

  const totalMedicines = 298;

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
                  List of Medicines ({totalMedicines})
                </span>
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
              </button>
            </div>

            <button
              type="button"
              className="grid h-14 w-14 place-items-center rounded-2xl border border-[#d8dfee] bg-[#f7f8fc] text-[#48588f]"
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

          <MedicineTable medicines={filteredMedicines} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
