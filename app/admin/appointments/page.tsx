"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

type AppointmentType = {
  id: number;
  name: string;
  appointmentCount: number;
  iconBgClass: string;
  slots: string[];
};

type SlotSort = "asc" | "desc";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", active: false },
  { label: "Manage Users", href: "/admin/users/manage", active: false },
  { label: "Appointments", href: "/admin/appointments", active: true },
  { label: "Pets", href: "#", active: false },
  { label: "Medicine", href: "#", active: false },
];

const INITIAL_APPOINTMENT_TYPES: AppointmentType[] = [
  {
    id: 1,
    name: "Pet Examination",
    appointmentCount: 94,
    iconBgClass: "from-[#f7be74] to-[#f0a84f]",
    slots: [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
    ],
  },
  {
    id: 2,
    name: "Vaccination",
    appointmentCount: 120,
    iconBgClass: "from-[#f3a4bb] to-[#ed829f]",
    slots: ["08:00 AM - 09:00 AM", "01:00 PM - 02:00 PM", "04:00 PM - 05:00 PM"],
  },
  {
    id: 3,
    name: "Grooming",
    appointmentCount: 56,
    iconBgClass: "from-[#a7c9fb] to-[#8cb5f0]",
    slots: ["09:30 AM - 10:30 AM", "01:30 PM - 02:30 PM", "04:30 PM - 05:30 PM"],
  },
  {
    id: 4,
    name: "Surgery",
    appointmentCount: 32,
    iconBgClass: "from-[#a7e3cf] to-[#81d1b7]",
    slots: ["07:00 AM - 09:00 AM", "12:30 PM - 02:30 PM"],
  },
  {
    id: 5,
    name: "Dental Consultation",
    appointmentCount: 19,
    iconBgClass: "from-[#c4b5fd] to-[#9ea4ff]",
    slots: ["10:30 AM - 11:30 AM", "03:30 PM - 04:30 PM"],
  },
  {
    id: 6,
    name: "Nutritional Counseling",
    appointmentCount: 41,
    iconBgClass: "from-[#ffe19a] to-[#f8c95f]",
    slots: ["08:30 AM - 09:30 AM", "12:00 PM - 01:00 PM"],
  },
  {
    id: 7,
    name: "Emergency Care",
    appointmentCount: 55,
    iconBgClass: "from-[#f9b0b0] to-[#f28484]",
    slots: ["06:00 AM - 07:00 AM", "07:00 PM - 08:00 PM"],
  },
];

const TYPE_PAGE_SIZE = 5;
const NEW_SLOT_CANDIDATES = [
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

function parseStartMinutes(slot: string) {
  const [start] = slot.split(" - ");
  const [timePart, period] = start.split(" ");
  const [rawHours, rawMinutes] = timePart.split(":").map(Number);

  let hours = rawHours;
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + rawMinutes;
}

function getTypeInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminAppointmentsPage() {
  const { user, logout } = useAuth();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(INITIAL_APPOINTMENT_TYPES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [activeTypeId, setActiveTypeId] = useState<number>(INITIAL_APPOINTMENT_TYPES[0].id);
  const [currentTypePage, setCurrentTypePage] = useState(1);
  const [slotSort, setSlotSort] = useState<SlotSort>("asc");

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
    if (!activeType) return [];

    return [...activeType.slots].sort((a, b) => {
      const aMinutes = parseStartMinutes(a);
      const bMinutes = parseStartMinutes(b);
      return slotSort === "asc" ? aMinutes - bMinutes : bMinutes - aMinutes;
    });
  }, [activeType, slotSort]);

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

  const handleAddType = () => {
    const typeName = window.prompt("Enter appointment type name:");
    if (!typeName?.trim()) return;

    const createdType: AppointmentType = {
      id: appointmentTypes.length ? Math.max(...appointmentTypes.map((typeItem) => typeItem.id)) + 1 : 1,
      name: typeName.trim(),
      appointmentCount: 0,
      iconBgClass: "from-[#8cabff] to-[#6887f0]",
      slots: ["09:00 AM - 10:00 AM"],
    };

    setAppointmentTypes((prev) => [createdType, ...prev]);
    setActiveTypeId(createdType.id);
    setCurrentTypePage(1);
  };

  const handleDeleteSelected = () => {
    if (!selectedTypeIds.length) return;

    setAppointmentTypes((prev) => prev.filter((typeItem) => !selectedTypeIds.includes(typeItem.id)));

    if (selectedTypeIds.includes(activeTypeId)) {
      const remaining = appointmentTypes.filter((typeItem) => !selectedTypeIds.includes(typeItem.id));
      setActiveTypeId(remaining[0]?.id ?? -1);
    }

    setSelectedTypeIds([]);
    setCurrentTypePage(1);
  };

  const handleAddSlot = () => {
    if (!activeType) return;

    const candidate = NEW_SLOT_CANDIDATES.find((slot) => !activeType.slots.includes(slot));
    if (!candidate) return;

    setAppointmentTypes((prev) =>
      prev.map((typeItem) =>
        typeItem.id === activeType.id
          ? { ...typeItem, slots: [...typeItem.slots, candidate] }
          : typeItem
      )
    );
  };

  const handleEditSlot = (slotValue: string) => {
    if (!activeType) return;

    const editedSlot = window.prompt("Edit time slot:", slotValue);
    if (!editedSlot?.trim()) return;

    setAppointmentTypes((prev) =>
      prev.map((typeItem) => {
        if (typeItem.id !== activeType.id) return typeItem;

        return {
          ...typeItem,
          slots: typeItem.slots.map((slot) => (slot === slotValue ? editedSlot.trim() : slot)),
        };
      })
    );
  };

  const typeShowingText =
    filteredTypes.length === 0
      ? "Showing 0 of 0 types"
      : `Showing ${typeStartIndex + 1}-${Math.min(typeStartIndex + TYPE_PAGE_SIZE, filteredTypes.length)} of ${filteredTypes.length} types`;

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f5f4fb] text-[#1f2a59]">
        <header className="bg-gradient-to-r from-[#2a2f79] to-[#2b347f] text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-5 py-4 xl:px-8">
            <div className="flex items-center gap-6 xl:gap-10">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-[#2a3889]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2l7 4v6c0 5-3.5 9.2-7 10-3.5-.8-7-5-7-10V6l7-4z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold leading-none tracking-tight">PetCore</span>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.9}
                    d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18a2 2 0 01-.58 1.4L4 17h5m6 0a3 3 0 11-6 0"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
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
                  <button
                    onClick={handleAddType}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f67ff] to-[#2258f0] px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
                  >
                    <span className="text-xl leading-none">+</span>
                    Add Appointment Type
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedTypeIds.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8dced] bg-[#f8f9ff] px-7 py-3 text-sm font-medium text-[#8a95bf] transition hover:bg-[#f2f5ff] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 7h12M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M7 7l1 12h8l1-12"
                      />
                    </svg>
                    Delete
                  </button>
                </div>

                <div className="relative mt-4 rounded-xl border border-[#d6d9e8] bg-[#f9faff] pl-12 pr-4">
                  <div className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-[#7884af]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
                      />
                    </svg>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentTypePage(1);
                    }}
                    placeholder="Search appointment type..."
                    className="h-12 w-full bg-transparent text-sm text-[#2b376f] placeholder:text-[#8e98bd] focus:outline-none"
                  />
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

                {visibleTypes.length === 0 ? (
                  <div className="grid h-[390px] place-items-center px-6 text-center text-lg text-[#7a86ae]">
                    No appointment types found for your current search.
                  </div>
                ) : (
                  <div>
                    {visibleTypes.map((typeItem, index) => {
                      const isActive = typeItem.id === activeTypeId;
                      return (
                        <div
                          key={typeItem.id}
                          className={`flex items-center gap-4 px-4 py-4 ${
                            index !== 0 ? "border-t border-[#eceff7]" : ""
                          } ${isActive ? "bg-[#f6f8ff]" : "bg-transparent"}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypeIds.includes(typeItem.id)}
                            onChange={() => handleToggleType(typeItem.id)}
                            className="h-5 w-5 rounded border-[#ccd3e9] text-[#4368ff] focus:ring-[#9eb2ff]"
                          />

                          <button
                            onClick={() => setActiveTypeId(typeItem.id)}
                            className="flex flex-1 items-center gap-4 text-left"
                          >
                            <div
                              className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${typeItem.iconBgClass} text-lg font-semibold text-white`}
                            >
                              {getTypeInitials(typeItem.name)}
                            </div>
                            <div>
                              <p className="text-lg leading-tight text-[#2d3a72]">{typeItem.name}</p>
                              <p className="text-sm text-[#7481ac]">{typeItem.appointmentCount} Appointments</p>
                            </div>
                          </button>

                          <button
                            onClick={() => setActiveTypeId(typeItem.id)}
                            className="inline-flex items-center gap-1 text-sm text-[#3e66f4] hover:text-[#2956ec]"
                          >
                            View
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
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
                  <button
                    onClick={() => setCurrentTypePage((prev) => Math.max(1, prev - 1))}
                    disabled={safeTypePage === 1}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-[#d5daea] bg-[#f7f8fc] disabled:cursor-not-allowed disabled:opacity-50"
                  >
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

                <button
                  onClick={handleAddSlot}
                  disabled={!activeType}
                  className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f67ff] to-[#2258f0] px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-xl leading-none">+</span>
                  Add Time Slot
                </button>
              </div>

              <div className="p-5 lg:p-6">
                {!activeType ? (
                  <div className="grid h-[430px] place-items-center rounded-2xl border border-[#e5e8f3] bg-white text-center text-lg text-[#7a86ae]">
                    Select an appointment type to manage its slots.
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-[#e1e5f1] bg-white">
                      {sortedSlots.map((slot, index) => (
                        <div
                          key={`${activeType.id}-${slot}`}
                          className={`flex items-center justify-between gap-3 px-5 py-4 ${
                            index !== 0 ? "border-t border-[#eceff7]" : ""
                          }`}
                        >
                          <p className="text-lg leading-tight text-[#2c396f]">{slot}</p>
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#d2d8ea] bg-[#f8f9ff] px-4 py-2 text-sm text-[#5a6693] hover:bg-[#f1f4ff]"
                          >
                            Edit
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <p className="mt-6 text-sm text-[#6673a3]">
                      Patients can book appointments during the selected time slots for {activeType.name}.
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

