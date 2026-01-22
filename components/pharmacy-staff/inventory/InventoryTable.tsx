// components/pharmacy-staff/inventory/InventoryTable.tsx
"use client";

import type { InventoryMedicine } from "@/types/pharmacy";

interface InventoryTableProps {
  medicines: InventoryMedicine[];
  onViewDetail: (medicineId: string) => void;
}

export default function InventoryTable({
  medicines,
  onViewDetail,
}: InventoryTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
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
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
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
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
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
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                Stock in Qty
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
        <tbody>
          {medicines.map((medicine, index) => (
            <tr
              key={medicine.id}
              className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                index === medicines.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="px-6 py-4 text-sm text-slate-900">
                {medicine.name}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {medicine.medicineId}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {medicine.groupName}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                {medicine.stockQuantity}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onViewDetail(medicine.id)}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                >
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
