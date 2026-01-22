// components/pharmacy-staff/medicine/MedicineTable.tsx
"use client";

import type { Medicine } from "@/types/pharmacy";

interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-white border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                Medicine Name
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
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                Medicine ID
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
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                Group Name
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
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {medicines.map((medicine) => (
            <tr
              key={medicine.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-slate-900">
                {medicine.name}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {medicine.medicineId}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {medicine.groupName}
              </td>
              <td className="px-6 py-4">
                <button className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  View Full Detail
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
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
