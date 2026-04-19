// components/doctor/appointments/AppointmentManagementTable.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  DoctorAppointment,
  DoctorAppointmentsPageResponse,
  DoctorAppointmentTab,
  DoctorTimeSlot,
} from "@/types/doctor";
import AppointmentRow from "./AppointmentRow";
import Pagination from "./Pagination";

const TAB_OPTIONS: Array<{ key: DoctorAppointmentTab; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "TODAY", label: "Today" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "COMPLETED", label: "Completed" },
];

const todayIso = new Date().toISOString().slice(0, 10);

const formatDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (time: string) => {
  const [hours = "00", minutes = "00"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const toInputTime = (time: string) => {
  const [hours = "00", minutes = "00"] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const mapUiStatusToApiStatus = (status: DoctorAppointment["status"]) => {
  if (status === "Upcoming") {
    return "PENDING";
  }
  return status.toUpperCase();
};

interface EditFormState {
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: DoctorAppointment["status"];
  notes: string;
}

const defaultEditForm: EditFormState = {
  appointmentDate: "",
  appointmentTime: "",
  appointmentType: "",
  status: "Upcoming",
  notes: "",
};

export default function AppointmentManagementTable() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<DoctorAppointmentTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>(defaultEditForm);
  const [editAvailableSlots, setEditAvailableSlots] = useState<DoctorTimeSlot[]>([]);
  const [editSlotsLoading, setEditSlotsLoading] = useState(false);
  const [editSlotsError, setEditSlotsError] = useState<string | null>(null);

  const [slotDate, setSlotDate] = useState(todayIso);
  const [slotStart, setSlotStart] = useState("10:00");
  const [slotEnd, setSlotEnd] = useState("10:30");
  const [slots, setSlots] = useState<DoctorTimeSlot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotBusy, setSlotBusy] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchText(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      tab: activeTab,
      page: String(currentPage - 1),
      size: String(pageSize),
    });
    if (searchText) {
      params.set("search", searchText);
    }
    if (filterDate) {
      params.set("date", filterDate);
    }

    try {
      const response = await apiFetch<DoctorAppointmentsPageResponse>(
        `/api/appointments/doctor/my?${params.toString()}`,
      );
      setAppointments(response.content);
      setTotalPages(Math.max(response.totalPages || 1, 1));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load appointments.");
      }
      setAppointments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, pageSize, searchText, filterDate]);

  const loadSlots = useCallback(async () => {
    setSlotsError(null);
    try {
      const response = await apiFetch<DoctorTimeSlot[]>(`/api/doctors/my/slots?date=${slotDate}`);
      setSlots(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setSlotsError(err.message);
      } else {
        setSlotsError("Failed to load time slots.");
      }
      setSlots([]);
    }
  }, [slotDate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleStatusAction = async (appointment: DoctorAppointment) => {
    if (appointment.status !== "Upcoming") {
      return;
    }

    setUpdatingStatusId(appointment.id);
    setError(null);
    try {
      await apiFetch(`/api/appointments/doctor/${appointment.id}/status`, {
        method: "PATCH",
        body: { status: "COMPLETED" },
      });
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update appointment status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openViewModal = async (appointment: DoctorAppointment) => {
    setViewingId(appointment.id);
    setError(null);
    try {
      const details = await apiFetch<DoctorAppointment>(`/api/appointments/doctor/${appointment.id}`);
      setSelectedAppointment(details);
      setIsViewModalOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load appointment details.");
    } finally {
      setViewingId(null);
    }
  };

  const openEditModal = async (appointment: DoctorAppointment) => {
    setViewingId(appointment.id);
    setError(null);
    try {
      const details = await apiFetch<DoctorAppointment>(`/api/appointments/doctor/${appointment.id}`);
      setSelectedAppointment(details);
      setEditForm({
        appointmentDate: details.appointmentDate,
        appointmentTime: toInputTime(details.appointmentTime),
        appointmentType: details.appointmentType || "",
        status: details.status,
        notes: details.notes || "",
      });
      setIsEditModalOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load appointment details.");
    } finally {
      setViewingId(null);
    }
  };

  const loadEditAvailableSlots = useCallback(
    async (date: string, appointmentId: number, preferredTime?: string) => {
      if (!date) {
        setEditAvailableSlots([]);
        setEditSlotsError(null);
        return;
      }

      setEditSlotsLoading(true);
      setEditSlotsError(null);
      try {
        const params = new URLSearchParams({
          date,
          excludeAppointmentId: String(appointmentId),
        });
        const response = await apiFetch<DoctorTimeSlot[]>(`/api/doctors/my/available-slots?${params.toString()}`);
        setEditAvailableSlots(response);

        setEditForm((prev) => {
          const desired = preferredTime ?? prev.appointmentTime;
          const hasDesired = response.some((slot) => toInputTime(slot.slotStart) === desired);
          if (hasDesired) {
            return prev;
          }

          return {
            ...prev,
            appointmentTime: response.length > 0 ? toInputTime(response[0].slotStart) : "",
          };
        });
      } catch (err) {
        setEditSlotsError(err instanceof ApiError ? err.message : "Failed to load available slots.");
        setEditAvailableSlots([]);
      } finally {
        setEditSlotsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isEditModalOpen || !selectedAppointment || !editForm.appointmentDate) {
      return;
    }

    loadEditAvailableSlots(editForm.appointmentDate, selectedAppointment.id);
  }, [isEditModalOpen, selectedAppointment, editForm.appointmentDate, loadEditAvailableSlots]);

  const submitEdit = async () => {
    if (!selectedAppointment) {
      return;
    }
    if (!editForm.appointmentDate || !editForm.appointmentTime || !editForm.appointmentType.trim()) {
      setError("Date, time, and appointment type are required.");
      return;
    }

    setEditingId(selectedAppointment.id);
    setError(null);
    try {
      await apiFetch<DoctorAppointment>(`/api/appointments/doctor/${selectedAppointment.id}`, {
        method: "PUT",
        body: {
          appointmentDate: editForm.appointmentDate,
          appointmentTime: `${editForm.appointmentTime}:00`,
          appointmentType: editForm.appointmentType.trim(),
          status: mapUiStatusToApiStatus(editForm.status),
          notes: editForm.notes.trim() || null,
        },
      });
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
      setEditForm(defaultEditForm);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update appointment.");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (appointment: DoctorAppointment) => {
    const confirmed = window.confirm(`Delete appointment for ${appointment.petName} on ${formatDate(appointment.appointmentDate)}?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(appointment.id);
    setError(null);
    try {
      await apiFetch<void>(`/api/appointments/doctor/${appointment.id}`, { method: "DELETE" });
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  const addSlot = async () => {
    setSlotBusy(true);
    setSlotsError(null);
    try {
      const response = await apiFetch<DoctorTimeSlot[]>("/api/doctors/my/slots", {
        method: "POST",
        body: {
          date: slotDate,
          startTime: `${slotStart}:00`,
          endTime: `${slotEnd}:00`,
        },
      });
      setSlots(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setSlotsError(err.message);
      } else {
        setSlotsError("Failed to add slot.");
      }
    } finally {
      setSlotBusy(false);
    }
  };

  const removeSlot = async (slot: DoctorTimeSlot) => {
    setSlotBusy(true);
    setSlotsError(null);
    try {
      const params = new URLSearchParams({
        date: slotDate,
        startTime: slot.slotStart,
        endTime: slot.slotEnd,
      });
      const response = await apiFetch<DoctorTimeSlot[]>(`/api/doctors/my/slots?${params.toString()}`, {
        method: "DELETE",
      });
      setSlots(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setSlotsError(err.message);
      } else {
        setSlotsError("Failed to remove slot.");
      }
    } finally {
      setSlotBusy(false);
    }
  };

  const sortedSlots = useMemo(
    () => [...slots].sort((a, b) => a.slotStart.localeCompare(b.slotStart)),
    [slots],
  );

  return (
    <div className="space-y-5 rounded-2xl bg-white/50">
      <div className="rounded-2xl border border-[#D7CEE8] bg-white/70 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-md">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Owner or Pet"
              className="w-full rounded-lg border border-[#D7CEE8] bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {TAB_OPTIONS.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:ml-auto">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-[#D7CEE8] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#D7CEE8] bg-white/80 shadow-sm">
        <div className="border-b border-slate-200/80 px-6 py-5">
          <h2 className="text-[32px] font-semibold text-[#22195E]">Appointment Management</h2>
        </div>

        {error && (
          <div className="mx-6 mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200/80 text-left text-xs font-semibold uppercase tracking-wider text-[#59529A]">
                <th className="px-6 py-4">Owner Name</th>
                <th className="px-6 py-4">Pet Name</th>
                <th className="px-6 py-4">Appointment Date &amp; Time</th>
                <th className="px-6 py-4">Appointment Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No appointments found for the selected filters.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    isLast={index === appointments.length - 1}
                    formattedDateTime={`${formatDate(appointment.appointmentDate)} - ${formatTime(appointment.appointmentTime)}`}
                    onStatusAction={handleStatusAction}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onView={openViewModal}
                    isUpdatingStatus={updatingStatusId === appointment.id}
                    isEditing={editingId === appointment.id}
                    isDeleting={deletingId === appointment.id}
                    isViewing={viewingId === appointment.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200/80 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="border-t border-slate-200/80 px-6 py-5">
          <h3 className="text-2xl font-semibold text-[#22195E]">Add Appointment Time Slots</h3>

          <div className="mt-4 grid gap-3 rounded-xl border border-[#D7CEE8] bg-white p-3 lg:grid-cols-[220px_170px_170px_140px_1fr] lg:items-center">
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="rounded-lg border border-[#D7CEE8] px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
            <input
              type="time"
              value={slotStart}
              onChange={(e) => setSlotStart(e.target.value)}
              className="rounded-lg border border-[#D7CEE8] px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
            <input
              type="time"
              value={slotEnd}
              onChange={(e) => setSlotEnd(e.target.value)}
              className="rounded-lg border border-[#D7CEE8] px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={addSlot}
              disabled={slotBusy}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {slotBusy ? "Saving..." : "Add Slot"}
            </button>

            <div className="flex flex-wrap gap-2">
              {sortedSlots.map((slot) => (
                <span
                  key={`${slot.slotStart}-${slot.slotEnd}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                >
                  {formatTime(slot.slotStart)} - {formatTime(slot.slotEnd)}
                  <button
                    type="button"
                    onClick={() => removeSlot(slot)}
                    disabled={slotBusy}
                    className="rounded p-0.5 text-rose-600 hover:bg-rose-100"
                    aria-label="Delete slot"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 6L6 18M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {slotsError && (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {slotsError}
            </p>
          )}
        </div>
      </div>

      {isViewModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#22195E]">Appointment Details</h3>
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedAppointment(null);
                }}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Close details"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700">
              <p><span className="font-semibold">Owner:</span> {selectedAppointment.ownerName}</p>
              <p><span className="font-semibold">Owner Phone:</span> {selectedAppointment.phoneNumber || "-"}</p>
              <p><span className="font-semibold">Pet:</span> {selectedAppointment.petName}</p>
              <p>
                <span className="font-semibold">Date &amp; Time:</span>{" "}
                {formatDate(selectedAppointment.appointmentDate)} - {formatTime(selectedAppointment.appointmentTime)}
              </p>
              <p><span className="font-semibold">Type:</span> {selectedAppointment.appointmentType || "-"}</p>
              <p><span className="font-semibold">Status:</span> {selectedAppointment.status}</p>
              <p><span className="font-semibold">Notes:</span> {selectedAppointment.notes || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#22195E]">Edit Appointment</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedAppointment(null);
                  setEditForm(defaultEditForm);
                }}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Close edit"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="text-sm text-slate-700">
                Date
                <input
                  type="date"
                  value={editForm.appointmentDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      appointmentDate: e.target.value,
                      appointmentTime: "",
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-[#D7CEE8] px-3 py-2 outline-none focus:border-indigo-400"
                />
              </label>

              <label className="text-sm text-slate-700">
                Time
                <select
                  value={editForm.appointmentTime}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, appointmentTime: e.target.value }))}
                  disabled={editSlotsLoading || editAvailableSlots.length === 0}
                  className="mt-1 w-full rounded-lg border border-[#D7CEE8] px-3 py-2 outline-none focus:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {editSlotsLoading ? (
                    <option value="">Loading slots...</option>
                  ) : editAvailableSlots.length === 0 ? (
                    <option value="">No available slots</option>
                  ) : (
                    editAvailableSlots.map((slot) => (
                      <option key={`${slot.slotStart}-${slot.slotEnd}`} value={toInputTime(slot.slotStart)}>
                        {formatTime(slot.slotStart)} - {formatTime(slot.slotEnd)}
                      </option>
                    ))
                  )}
                </select>
                {editSlotsError && <p className="mt-1 text-xs text-rose-600">{editSlotsError}</p>}
              </label>

              <label className="text-sm text-slate-700">
                Appointment Type
                <input
                  type="text"
                  value={editForm.appointmentType}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, appointmentType: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#D7CEE8] px-3 py-2 outline-none focus:border-indigo-400"
                />
              </label>

              <label className="text-sm text-slate-700">
                Status
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as DoctorAppointment["status"],
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-[#D7CEE8] px-3 py-2 outline-none focus:border-indigo-400"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label className="text-sm text-slate-700">
                Notes
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 min-h-[100px] w-full rounded-lg border border-[#D7CEE8] px-3 py-2 outline-none focus:border-indigo-400"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedAppointment(null);
                  setEditForm(defaultEditForm);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitEdit}
                disabled={editingId === selectedAppointment.id}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {editingId === selectedAppointment.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
