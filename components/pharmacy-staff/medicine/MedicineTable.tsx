// components/pharmacy-staff/medicine/MedicineTable.tsx
"use client";

import type { Medicine } from "@/types/pharmacy";

interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce2ef] bg-white">
      <table className="w-full">
        <thead className="border-b border-[#dce2ef] bg-white">
          <tr>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <div className="flex items-center gap-2">
                Medicine Name
                <svg
                  className="h-5 w-5"
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
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <div className="flex items-center gap-2">
                Medicine ID
                <svg
                  className="h-5 w-5"
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
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <div className="flex items-center gap-2">
                Group Name
                <svg
                  className="h-5 w-5"
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
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e3e8f2]">
          {medicines.map((medicine) => (
            <tr key={medicine.id} className="transition-colors hover:bg-[#f7f9ff]">
              <td className="px-8 py-5 text-[20px] text-[#1f2a58]">{medicine.name}</td>
              <td className="px-8 py-5 text-[20px] text-[#1f2a58]">{medicine.medicineId}</td>
              <td className="px-8 py-5 text-[20px] text-[#1f2a58]">{medicine.groupName}</td>
              <td className="px-8 py-5">
                <button className="flex items-center gap-2 text-[20px] font-medium text-[#1d2c66] hover:text-[#1f5fe0] transition-colors">
                  View Full Detail
                  <svg
                    className="h-5 w-5"
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
