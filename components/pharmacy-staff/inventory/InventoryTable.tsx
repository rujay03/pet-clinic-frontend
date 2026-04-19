// components/pharmacy-staff/inventory/InventoryTable.tsx
"use client";

import type { InventoryMedicine } from "@/types/pharmacy";

type SortKey = "name" | "medicineId" | "groupName" | "stockQuantity";
type SortDirection = "asc" | "desc";

interface InventoryTableProps {
  medicines: InventoryMedicine[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onView: (medicineId: string) => void;
  onEdit: (medicineId: string) => void;
  onDelete: (medicineId: string) => void;
}

function getStockStatus(quantity: number, reorderLevel: number) {
  if (quantity <= 0) {
    return { label: "Out", className: "bg-red-100 text-red-700" };
  }
  if (quantity <= reorderLevel) {
    return { label: "Low", className: "bg-amber-100 text-amber-700" };
  }
  return { label: "In", className: "bg-emerald-100 text-emerald-700" };
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-[#1f5fe0]" : "text-[#243468]"}`}
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
      {active && (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "asc" ? "M11 6h2" : "M11 18h2"}
        />
      )}
    </svg>
  );
}

export default function InventoryTable({
  medicines,
  sortKey,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce2ef] bg-white">
      <table className="w-full">
        <thead className="border-b border-[#dce2ef] bg-white">
          <tr>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <button
                type="button"
                onClick={() => onSort("name")}
                className="flex items-center gap-2"
              >
                Medicine Name
                <SortIcon
                  active={sortKey === "name"}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <button
                type="button"
                onClick={() => onSort("medicineId")}
                className="flex items-center gap-2"
              >
                Medicine ID
                <SortIcon
                  active={sortKey === "medicineId"}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <button
                type="button"
                onClick={() => onSort("groupName")}
                className="flex items-center gap-2"
              >
                Group Name
                <SortIcon
                  active={sortKey === "groupName"}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              <button
                type="button"
                onClick={() => onSort("stockQuantity")}
                className="flex items-center gap-2"
              >
                Stock in Qty
                <SortIcon
                  active={sortKey === "stockQuantity"}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className="px-8 py-5 text-left text-[20px] font-semibold text-[#18214f]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e3e8f2]">
          {medicines.map((medicine) => {
            const reorderLevel = medicine.reorderLevel ?? 50;
            const status = getStockStatus(medicine.stockQuantity, reorderLevel);

            return (
              <tr
                key={medicine.id}
                className="transition-colors hover:bg-[#f7f9ff]"
              >
                <td className="px-8 py-5 text-[20px] text-[#1f2a58]">
                  {medicine.name}
                </td>
                <td className="px-8 py-5 text-[20px] text-[#1f2a58]">
                  {medicine.medicineId}
                </td>
                <td className="px-8 py-5 text-[20px] text-[#1f2a58]">
                  {medicine.groupName}
                </td>
                <td className="px-8 py-5 text-[20px] text-[#1f2a58]">
                  <div className="flex items-center gap-3">
                    <span>{medicine.stockQuantity}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onView(medicine.id)}
                      className="rounded-lg border border-[#d2d9ec] px-3 py-1.5 text-sm font-medium text-[#2a3a70] hover:bg-[#eef3ff]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(medicine.id)}
                      className="rounded-lg border border-[#d2d9ec] px-3 py-1.5 text-sm font-medium text-[#2a3a70] hover:bg-[#eef3ff]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(medicine.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {medicines.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-8 py-10 text-center text-base text-[#50608f]"
              >
                No medicines found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
