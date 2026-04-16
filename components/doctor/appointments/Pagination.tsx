// components/doctor/appointments/Pagination.tsx
"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-700">
        {currentPage}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages || 1, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
      >
        {[5, 10, 20].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
