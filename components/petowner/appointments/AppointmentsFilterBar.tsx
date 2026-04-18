"use client";

export interface AppointmentFilters {
  petId: string;       // "" means all
  doctorName: string;  // "" means all
  date: string;        // YYYY-MM-DD, "" means all dates
  search: string;
}

interface AppointmentsFilterBarProps {
  filters: AppointmentFilters;
  onFiltersChange: (filters: AppointmentFilters) => void;
  onApply: () => void;
  pets: { id: number; name: string }[];
  doctors: string[];
}

export default function AppointmentsFilterBar({
  filters,
  onFiltersChange,
  onApply,
  pets,
  doctors,
}: AppointmentsFilterBarProps) {
  const update = (partial: Partial<AppointmentFilters>) =>
    onFiltersChange({ ...filters, ...partial });

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Pet filter */}
      <div className="relative">
        <select
          value={filters.petId}
          onChange={(e) => update({ petId: e.target.value })}
          className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Pets</option>
          {pets.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 21c-1.5 0-3-.5-4-1.5C7 18.5 6 17 6 15.5c0-2 2-4 6-6 4 2 6 4 6 6 0 1.5-1 3-2 4-1 1-2.5 1.5-4 1.5z" />
          </svg>
        </span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* Doctor filter */}
      <div className="relative">
        <select
          value={filters.doctorName}
          onChange={(e) => update({ doctorName: e.target.value })}
          className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* Date filter */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => update({ date: e.target.value })}
          className="rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Filter by date"
        />
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-50">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search appointments..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Apply */}
      <button
        type="button"
        onClick={onApply}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
      >
        Apply Filters
      </button>
    </div>
  );
}
