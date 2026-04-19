// components/pharmacy-staff/medicine/MedicineTable.tsx
"use client";

import type { Medicine } from "@/types/pharmacy";

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
}

export default function MedicineTable({
  medicines,
  onEdit,
  onDelete,
}: MedicineTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce2ef] bg-white">
      <table className="w-full">
        <thead className="border-b border-[#dce2ef] bg-white">
          <tr>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Medicine ID
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Name
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Generic Name
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Form
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Strength
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Status
            </th>
            <th className="px-6 py-5 text-left text-[18px] font-semibold text-[#18214f]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e3e8f2]">
          {medicines.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-8 py-8 text-center text-lg text-[#596892]">
                No medicines found.
              </td>
            </tr>
          ) : null}

          {medicines.map((medicine) => (
            <tr key={medicine.id} className="transition-colors hover:bg-[#f7f9ff]">
              <td className="px-6 py-5 text-[16px] text-[#1f2a58]">{medicine.id}</td>
              <td className="px-6 py-5 text-[16px] text-[#1f2a58]">{medicine.name}</td>
              <td className="px-6 py-5 text-[16px] text-[#1f2a58]">
                {medicine.genericName || "-"}
              </td>
              <td className="px-6 py-5 text-[16px] text-[#1f2a58]">{medicine.form || "-"}</td>
              <td className="px-6 py-5 text-[16px] text-[#1f2a58]">
                {medicine.strength || "-"}
              </td>
              <td className="px-6 py-5">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    medicine.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {medicine.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(medicine)}
                    className="rounded-lg border border-[#c9d5ef] px-3 py-1.5 text-sm font-medium text-[#1f5fe0] hover:bg-[#eef3ff]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(medicine)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
