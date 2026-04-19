"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiFetch } from "@/lib/api";

type AppointmentType = {
  id: number;
  name: string;
  appointmentCount: number;
  iconBgClass: string;
};

type DoctorSummary = {
  id: number;
  name: string;
};

type TimeSlotApi = {
  slotStart: string;
  slotEnd: string;
};

type ManagedSlot = {
  startTime: string;
  endTime: string;
  label: string;
};

type WeeklyScheduleItem = {
  scheduleId: number;
  doctorId: number | null;
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
  label: string;
};

type SlotSort = "asc" | "desc";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", active: false },
  { label: "Manage Users", href: "/admin/users/manage", active: false },
  { label: "Appointments", href: "/admin/appointments", active: true },
  { label: "Pets", href: "/admin/pets", active: false },
];

const TYPE_PAGE_SIZE = 5;
const ICON_GRADIENTS = [
  "from-[#f7be74] to-[#f0a84f]",
  "from-[#f3a4bb] to-[#ed829f]",
  "from-[#a7c9fb] to-[#8cb5f0]",
  "from-[#a7e3cf] to-[#81d1b7]",
  "from-[#c4b5fd] to-[#9ea4ff]",
  "from-[#ffe19a] to-[#f8c95f]",
  "from-[#f9b0b0] to-[#f28484]",
  "from-[#8cabff] to-[#6887f0]",
];

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseStartMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasTimeOverlap(start: string, end: string, existingStart: string, existingEnd: string) {
  const startMinutes = parseStartMinutes(toInputTime(start));
  const endMinutes = parseStartMinutes(toInputTime(end));
  const existingStartMinutes = parseStartMinutes(toInputTime(existingStart));
  const existingEndMinutes = parseStartMinutes(toInputTime(existingEnd));
  return startMinutes < existingEndMinutes && endMinutes > existingStartMinutes;
}

function format24hTo12h(value: string) {
  const [hoursText, minutesText] = value.split(":");
  let hours = Number(hoursText);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, "0")}:${minutesText} ${period}`;
}

function toInputTime(value: string) {
  return value.slice(0, 5);
}

function normalizeInputTime(value: string | null): string | null {
  if (!value) return null;
  const safe = value.trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(safe)) return null;
  return `${safe}:00`;
}

function getTypeInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function toManagedSlots(slots: TimeSlotApi[]): ManagedSlot[] {
  return slots.map((slot) => ({
    startTime: slot.slotStart,
    endTime: slot.slotEnd,
    label: `${format24hTo12h(toInputTime(slot.slotStart))} - ${format24hTo12h(toInputTime(slot.slotEnd))}`,
  }));
}

function toWeeklyScheduleItems(
  schedules: Array<{
    scheduleId: number;
    doctorId: number | null;
    doctorName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    active: boolean;
  }>
): WeeklyScheduleItem[] {
  return schedules.map((item) => ({
    ...item,
    label: `${format24hTo12h(toInputTime(item.startTime))} - ${format24hTo12h(toInputTime(item.endTime))}`,
  }));
}

function formatDayOfWeek(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

function getWeeklyValidationMessage(
  startTime: string,
  endTime: string,
  schedules: WeeklyScheduleItem[],
  editingId?: number
) {
  const startMinutes = parseStartMinutes(toInputTime(startTime));
  const endMinutes = parseStartMinutes(toInputTime(endTime));

  if (endMinutes <= startMinutes) {
    return "End time must be after start time.";
  }

  const conflicting = schedules.find((item) => {
    if (editingId && item.scheduleId === editingId) return false;
    return hasTimeOverlap(startTime, endTime, item.startTime, item.endTime);
  });

  if (conflicting) {
    return `Time slot conflict with existing slot ${conflicting.label} on ${formatDayOfWeek(conflicting.dayOfWeek)}.`;
  }

  return null;
}

export default function AdminAppointmentsPage() {
  const { user, logout } = useAuth();

  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
  const [currentTypePage, setCurrentTypePage] = useState(1);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate());
  const [slots, setSlots] = useState<ManagedSlot[]>([]);
  const [slotSort, setSlotSort] = useState<SlotSort>("asc");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [weeklySchedules, setWeeklySchedules] = useState<WeeklyScheduleItem[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);

  const fetchTypes = async () => {
    try {
      setTypesLoading(true);
      setTypesError(null);
      const response = await apiFetch<Array<{ id: number; name: string; appointmentCount: number }>>(
        "/api/admin/appointments/types"
      );
      const mapped = response.map((typeItem, index) => ({
        ...typeItem,
        iconBgClass: ICON_GRADIENTS[index % ICON_GRADIENTS.length],
      }));

      setAppointmentTypes(mapped);
      setSelectedTypeIds((prev) => prev.filter((id) => mapped.some((typeItem) => typeItem.id === id)));
      setActiveTypeId((prev) => {
        if (prev && mapped.some((typeItem) => typeItem.id === prev)) return prev;
        return mapped[0]?.id ?? null;
      });
    } catch (error) {
      setTypesError(getErrorMessage(error));
    } finally {
      setTypesLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await apiFetch<DoctorSummary[]>("/api/admin/appointments/doctors");
      setDoctors(response);
      setSelectedDoctorId((prev) => prev ?? response[0]?.id ?? null);
    } catch (error) {
      setSlotsError(getErrorMessage(error));
    }
  };

  const fetchSlots = async (doctorId: number, date: string) => {
    try {
      setSlotsLoading(true);
      setSlotsError(null);
      const response = await apiFetch<TimeSlotApi[]>(
        `/api/admin/appointments/slots?doctorId=${doctorId}&date=${date}`
      );
      setSlots(toManagedSlots(response));
    } catch (error) {
      setSlotsError(getErrorMessage(error));
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const fetchWeeklySchedules = async (doctorId: number | null) => {
    try {
      setWeeklyLoading(true);
      setWeeklyError(null);
      if (!doctorId) {
        setWeeklySchedules([]);
        return;
      }
      const response = await apiFetch<WeeklyScheduleItem[]>(
        `/api/admin/appointments/weekly-schedules?doctorId=${doctorId}`
      );
      setWeeklySchedules(toWeeklyScheduleItems(response));
    } catch (error) {
      setWeeklyError(getErrorMessage(error));
      setWeeklySchedules([]);
    } finally {
      setWeeklyLoading(false);
    }
  };

  useEffect(() => {
    void fetchTypes();
    void fetchDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setSlots([]);
      return;
    }
    void fetchSlots(selectedDoctorId, selectedDate);
  }, [selectedDoctorId, selectedDate]);

  const filteredTypes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return appointmentTypes;
    return appointmentTypes.filter((typeItem) => typeItem.name.toLowerCase().includes(query));
  }, [appointmentTypes, searchQuery]);

  const totalTypePages = Math.max(1, Math.ceil(filteredTypes.length / TYPE_PAGE_SIZE));
  const safeTypePage = Math.min(currentTypePage, totalTypePages);
  const typeStartIndex = (safeTypePage - 1) * TYPE_PAGE_SIZE;
  const visibleTypes = filteredTypes.slice(typeStartIndex, typeStartIndex + TYPE_PAGE_SIZE);

  const activeType = appointmentTypes.find((typeItem) => typeItem.id === activeTypeId) ?? null;

  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) => {
      const aMinutes = parseStartMinutes(toInputTime(a.startTime));
      const bMinutes = parseStartMinutes(toInputTime(b.startTime));
      return slotSort === "asc" ? aMinutes - bMinutes : bMinutes - aMinutes;
    });
  }, [slots, slotSort]);

  const allVisibleSelected =
    visibleTypes.length > 0 && visibleTypes.every((typeItem) => selectedTypeIds.includes(typeItem.id));

  const handleToggleType = (typeId: number) => {
    setSelectedTypeIds((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleToggleVisibleTypes = () => {
    const visibleIds = visibleTypes.map((typeItem) => typeItem.id);
    if (allVisibleSelected) {
      setSelectedTypeIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedTypeIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleAddType = async () => {
    const typeName = window.prompt("Enter appointment type name:");
    if (!typeName?.trim()) return;

    try {
      await apiFetch("/api/admin/appointments/types", {
        method: "POST",
        body: { name: typeName.trim() },
      });
      await fetchTypes();
      setCurrentTypePage(1);
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedTypeIds.length) return;

    try {
      await Promise.all(
        selectedTypeIds.map((typeId) =>
          apiFetch(`/api/admin/appointments/types/${typeId}`, {
            method: "DELETE",
          })
        )
      );
      setSelectedTypeIds([]);
      setCurrentTypePage(1);
      await fetchTypes();
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  const handleAddSlot = async () => {
    if (!selectedDoctorId || !selectedDate) return;

    const start = normalizeInputTime(window.prompt("Enter start time (HH:mm)", "09:00"));
    if (!start) {
      window.alert("Invalid start time. Use HH:mm format.");
      return;
    }

    const end = normalizeInputTime(window.prompt("Enter end time (HH:mm)", "10:00"));
    if (!end) {
      window.alert("Invalid end time. Use HH:mm format.");
      return;
    }

    try {
      const response = await apiFetch<TimeSlotApi[]>("/api/admin/appointments/slots", {
        method: "POST",
        body: {
          doctorId: selectedDoctorId,
          date: selectedDate,
          startTime: start,
          endTime: end,
        },
      });
      setSlots(toManagedSlots(response));
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  const handleEditSlot = async (slot: ManagedSlot) => {
    if (!selectedDoctorId || !selectedDate) return;

    const nextStart = normalizeInputTime(
      window.prompt("Edit start time (HH:mm)", toInputTime(slot.startTime))
    );
    if (!nextStart) {
      window.alert("Invalid start time. Use HH:mm format.");
      return;
    }

    const nextEnd = normalizeInputTime(window.prompt("Edit end time (HH:mm)", toInputTime(slot.endTime)));
    if (!nextEnd) {
      window.alert("Invalid end time. Use HH:mm format.");
      return;
    }

    try {
      await apiFetch(
        `/api/admin/appointments/slots?doctorId=${selectedDoctorId}&date=${selectedDate}&startTime=${slot.startTime}&endTime=${slot.endTime}`,
        { method: "DELETE" }
      );
      const response = await apiFetch<TimeSlotApi[]>("/api/admin/appointments/slots", {
        method: "POST",
        body: {
          doctorId: selectedDoctorId,
          date: selectedDate,
          startTime: nextStart,
          endTime: nextEnd,
        },
      });
      setSlots(toManagedSlots(response));
    } catch (error) {
      window.alert(getErrorMessage(error));
      await fetchSlots(selectedDoctorId, selectedDate);
    }
  };

  const handleDeleteSlot = async (slot: ManagedSlot) => {
    if (!selectedDoctorId || !selectedDate) return;

    try {
      const response = await apiFetch<TimeSlotApi[]>(
        `/api/admin/appointments/slots?doctorId=${selectedDoctorId}&date=${selectedDate}&startTime=${slot.startTime}&endTime=${slot.endTime}`,
        { method: "DELETE" }
      );
      setSlots(toManagedSlots(response));
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  const handleAddWeeklySchedule = async () => {
    if (!selectedDoctorId) {
      window.alert("Select a doctor first.");
      return;
    }

    const day = window.prompt("Day (MONDAY-SUNDAY)", "MONDAY")?.toUpperCase();
    if (!day || !DAYS_OF_WEEK.includes(day as (typeof DAYS_OF_WEEK)[number])) {
      window.alert("Invalid day of week.");
      return;
    }

    const start = normalizeInputTime(window.prompt("Start time (HH:mm)", "09:00"));
    const end = normalizeInputTime(window.prompt("End time (HH:mm)", "10:00"));
    if (!start || !end) {
      window.alert("Invalid time format. Use HH:mm.");
      return;
    }

    const sameDaySchedules = weeklySchedules.filter((item) => item.dayOfWeek === day);
    const validationMessage = getWeeklyValidationMessage(start, end, sameDaySchedules);
    if (validationMessage) {
      window.alert(validationMessage);
      return;
    }

    try {
      await apiFetch("/api/admin/appointments/weekly-schedules", {
        method: "POST",
        body: { doctorId: selectedDoctorId, dayOfWeek: day, startTime: start, endTime: end },
      });
      await fetchWeeklySchedules(selectedDoctorId);
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  const handleEditWeeklySchedule = async (item: WeeklyScheduleItem) => {
    const nextStart = normalizeInputTime(
      window.prompt("Edit start time (HH:mm)", toInputTime(item.startTime))
    );
    if (!nextStart) {
      window.alert("Invalid start time. Use HH:mm format.");
      return;
    }

    const nextEnd = normalizeInputTime(window.prompt("Edit end time (HH:mm)", toInputTime(item.endTime)));
    if (!nextEnd) {
      window.alert("Invalid end time. Use HH:mm format.");
      return;
    }

    const sameDaySchedules = weeklySchedules.filter((scheduleItem) => scheduleItem.dayOfWeek === item.dayOfWeek);
    const validationMessage = getWeeklyValidationMessage(nextStart, nextEnd, sameDaySchedules, item.scheduleId);
    if (validationMessage) {
      window.alert(validationMessage);
      return;
    }

    try {
      await apiFetch(`/api/admin/appointments/weekly-schedules/${item.scheduleId}`, {
        method: "DELETE",
      });
      await apiFetch("/api/admin/appointments/weekly-schedules", {
        method: "POST",
        body: {
          doctorId: item.doctorId,
          dayOfWeek: item.dayOfWeek,
          startTime: nextStart,
          endTime: nextEnd,
        },
      });
      await fetchWeeklySchedules(selectedDoctorId);
    } catch (error) {
      window.alert(getErrorMessage(error));
      await fetchWeeklySchedules(selectedDoctorId);
    }
  };

  const typeShowingText =
    filteredTypes.length === 0
      ? "Showing 0 of 0 types"
      : `Showing ${typeStartIndex + 1}-${Math.min(typeStartIndex + TYPE_PAGE_SIZE, filteredTypes.length)} of ${filteredTypes.length} types`;

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f5f4fb] text-[#1f2a59]">
        <header className="bg-gradient-to-r from-[#2a2f79] to-[#2b347f] text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-5 py-4 xl:px-8">
            <div className="flex items-center gap-6 xl:gap-10">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white/95">
                  <Image src="/logo.png" alt="PetCore logo" width={36} height={36} className="h-9 w-9 object-contain" priority />
                </div>
                <span className="text-lg font-semibold leading-none tracking-tight">PetCore</span>
              </div>

              <nav className="hidden items-center gap-2 md:flex lg:gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-4 py-2 text-xs transition-colors ${
                      item.active
                        ? "bg-white/10 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18a2 2 0 01-.58 1.4L4 17h5m6 0a3 3 0 11-6 0" />
                </svg>
              </button>
              <button
                onClick={logout}
                className="rounded-xl border border-white/30 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Logout
              </button>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-[#4b58ae]">
                {user.email[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1300px] px-5 pb-10 pt-10 xl:px-8">
          <h1 className="text-3xl font-semibold leading-[1.1] text-[#1f295a]">Appointment Management</h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-[#99a5cb]">
            <span className="text-sm text-[#7f8bb3]">Admin Panel</span>
            <span className="text-sm">&gt;</span>
            <span className="text-sm text-[#2f3b71]">Appointments</span>
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#d9dced] bg-white/65 shadow-[0_2px_8px_rgba(37,54,112,0.03)]">
              <div className="border-b border-[#e6e8f2] p-5 lg:p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={handleAddType} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f67ff] to-[#2258f0] px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-105">
                    <span className="text-xl leading-none">+</span>
                    Add Appointment Type
                  </button>

                  <button onClick={handleDeleteSelected} disabled={selectedTypeIds.length === 0} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8dced] bg-[#f8f9ff] px-7 py-3 text-sm font-medium text-[#8a95bf] transition hover:bg-[#f2f5ff] disabled:cursor-not-allowed disabled:opacity-70">
                    Delete
                  </button>
                </div>

                <div className="relative mt-4 rounded-xl border border-[#d6d9e8] bg-[#f9faff] pl-12 pr-4">
                  <div className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-[#7884af]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <input value={searchQuery} onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentTypePage(1);
                  }} placeholder="Search appointment type..." className="h-12 w-full bg-transparent text-sm text-[#2b376f] placeholder:text-[#8e98bd] focus:outline-none" />
                </div>
              </div>

              <div className="min-h-[460px]">
                <div className="border-b border-[#e6e8f2] px-5 py-3">
                  <label className="inline-flex items-center gap-2 text-sm text-[#5d6a99]">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={handleToggleVisibleTypes}
                      className="h-5 w-5 rounded border-[#ccd3e9] text-[#4368ff] focus:ring-[#9eb2ff]"
                    />
                    Select all visible types
                  </label>
                </div>

                {typesLoading ? (
                  <div className="grid h-[390px] place-items-center px-6 text-center text-lg text-[#7a86ae]">
                    Loading appointment types...
                  </div>
                ) : typesError ? (
                  <div className="grid h-[390px] place-items-center px-6 text-center text-lg text-[#d24b72]">
                    {typesError}
                  </div>
                ) : visibleTypes.length === 0 ? (
                  <div className="grid h-[390px] place-items-center px-6 text-center text-lg text-[#7a86ae]">
                    No appointment types found for your current search.
                  </div>
                ) : (
                  <div>
                    {visibleTypes.map((typeItem, index) => {
                      const isActive = typeItem.id === activeTypeId;
                      return (
                        <div key={typeItem.id} className={`flex items-center gap-4 px-4 py-4 ${index !== 0 ? "border-t border-[#eceff7]" : ""} ${isActive ? "bg-[#f6f8ff]" : "bg-transparent"}`}>
                          <input type="checkbox" checked={selectedTypeIds.includes(typeItem.id)} onChange={() => handleToggleType(typeItem.id)} className="h-5 w-5 rounded border-[#ccd3e9] text-[#4368ff] focus:ring-[#9eb2ff]" />

                          <button onClick={() => setActiveTypeId(typeItem.id)} className="flex flex-1 items-center gap-4 text-left">
                            <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${typeItem.iconBgClass} text-lg font-semibold text-white`}>
                              {getTypeInitials(typeItem.name)}
                            </div>
                            <div>
                              <p className="text-lg leading-tight text-[#2d3a72]">{typeItem.name}</p>
                              <p className="text-sm text-[#7481ac]">{typeItem.appointmentCount} Appointments</p>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e8f2] px-5 py-4">
                <p className="text-sm text-[#5f6da0]">{typeShowingText}</p>
                <div className="flex items-center gap-3 text-sm text-[#6c78a7]">
                  <button onClick={() => setCurrentTypePage((prev) => Math.max(1, prev - 1))} disabled={safeTypePage === 1} className="grid h-9 w-9 place-items-center rounded-xl border border-[#d5daea] bg-[#f7f8fc] disabled:cursor-not-allowed disabled:opacity-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="font-medium text-[#2f67ff]">{safeTypePage}</span>
                  <button
                    onClick={() => setCurrentTypePage((prev) => Math.min(totalTypePages, prev + 1))}
                    disabled={safeTypePage === totalTypePages}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#d5daea] bg-[#f7f8fc] px-4 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#d9dced] bg-white/65 shadow-[0_2px_8px_rgba(37,54,112,0.03)]">
              <div className="border-b border-[#e6e8f2] p-5 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#2d3a72]">
                    <svg className="h-5 w-5 text-[#6a4eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2.5 2.5M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                    </svg>
                    Appointment Time Slots
                  </h2>

                  <div className="relative">
                    <select
                      value={slotSort}
                      onChange={(event) => setSlotSort(event.target.value as SlotSort)}
                      className="h-12 appearance-none rounded-xl border border-[#d6d9e8] bg-[#f9faff] px-4 pr-11 text-sm text-[#5d6a99] focus:outline-none"
                    >
                      <option value="asc">Sort by: Earliest</option>
                      <option value="desc">Sort by: Latest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-[#7d89b0]">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <select
                    value={selectedDoctorId ?? ""}
                    onChange={(event) => setSelectedDoctorId(event.target.value ? Number(event.target.value) : null)}
                    className="h-12 rounded-xl border border-[#d6d9e8] bg-[#f9faff] px-4 text-sm text-[#5d6a99] focus:outline-none"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="h-12 rounded-xl border border-[#d6d9e8] bg-[#f9faff] px-4 text-sm text-[#5d6a99] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddSlot}
                  disabled={!selectedDoctorId || !selectedDate}
                  className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f67ff] to-[#2258f0] px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-xl leading-none">+</span>
                  Add Time Slot
                </button>
              </div>

              <div className="p-5 lg:p-6">
                {slotsLoading ? (
                  <div className="grid h-[430px] place-items-center rounded-2xl border border-[#e5e8f3] bg-white text-center text-lg text-[#7a86ae]">
                    Loading slots...
                  </div>
                ) : slotsError ? (
                  <div className="grid h-[430px] place-items-center rounded-2xl border border-[#e5e8f3] bg-white text-center text-lg text-[#d24b72]">
                    {slotsError}
                  </div>
                ) : !selectedDoctorId ? (
                  <div className="grid h-[430px] place-items-center rounded-2xl border border-[#e5e8f3] bg-white text-center text-lg text-[#7a86ae]">
                    Select a doctor to manage schedule slots.
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-[#e1e5f1] bg-white">
                      {sortedSlots.map((slot, index) => (
                        <div
                          key={`${slot.startTime}-${slot.endTime}`}
                          className={`flex items-center justify-between gap-3 px-5 py-4 ${
                            index !== 0 ? "border-t border-[#eceff7]" : ""
                          }`}
                        >
                          <p className="text-lg leading-tight text-[#2c396f]">{slot.label}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditSlot(slot)}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#d2d8ea] bg-[#f8f9ff] px-4 py-2 text-sm text-[#5a6693] hover:bg-[#f1f4ff]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#d2d8ea] bg-[#f8f9ff] px-4 py-2 text-sm text-[#5a6693] hover:bg-[#f1f4ff]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {sortedSlots.length === 0 && (
                        <div className="px-5 py-8 text-center text-[#7a86ae]">No slots found for the selected date.</div>
                      )}
                    </div>

                    <p className="mt-6 text-sm text-[#6673a3]">
                      Slots are loaded from `doctor_schedule_override` and fallback schedule rows in
                      `doctor_weekly_schedule`.
                    </p>
                  </>
                )}
              </div>

              <div className="border-t border-[#e6e8f2] px-5 py-4 text-center text-sm text-[#5f6da0]">
                Showing {sortedSlots.length} of {sortedSlots.length} time slots
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

