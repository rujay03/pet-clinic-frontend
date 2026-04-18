"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { Pet } from "@/types/pet";
import type { Appointment } from "@/types/appointment";
import AppointmentsHeader from "./AppointmentsHeader";
import AppointmentsTabs, { type TabType } from "./AppointmentsTabs";
import AppointmentsFilterBar, {
  type AppointmentFilters,
} from "./AppointmentsFilterBar";
import AppointmentsList from "./AppointmentsList";
import BookingModal from "../booking/BookingModal";
import CancelConfirmModal from "./CancelConfirmModal";
import RescheduleModal from "./RescheduleModal";

const PAGE_SIZE = 5;

function toIsoDay(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

export default function AppointmentsPageShell() {
  // ── data ──
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── UI state ──
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [filters, setFilters] = useState<AppointmentFilters>({
    petId: "",
    doctorName: "",
    date: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<AppointmentFilters>({
    petId: "",
    doctorName: "",
    date: "",
    search: "",
  });
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<{ id: number; petName: string } | null>(null);

  // ── fetch data ──
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load pets
      const petsData = await apiFetch<Pet[]>("/api/pets");
      setPets(petsData);

      // Load appointments
      try {
        const raw = await apiFetch<any[]>("/api/appointments/my");
        const mapped: Appointment[] = raw.map((a) => ({
          id: a.id,
          petId: a.petId,
          petName: a.petName || "Unknown",
          petBreed: a.petBreed || a.breed || undefined,
          petImageUrl: a.petImageUrl || undefined,
          petSpecies: a.petSpecies || a.species || undefined,
          doctorName: a.doctorName || "Dr. Unknown",
          doctorImageUrl: a.doctorImageUrl || undefined,
          appointmentDate: a.appointmentDate || a.date || "",
          appointmentTime: a.appointmentTime || a.time || "",
          status: a.status || "Pending",
          reason: a.reason || undefined,
          notes: a.notes || undefined,
          price: a.price || undefined,
        }));
        setAppointments(mapped);
      } catch {
        // endpoint not available yet
        setAppointments([]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── derived lists ──
  const applyFilters = useCallback(
    (list: Appointment[]) => {
      const f = appliedFilters;
      return list.filter((a) => {
        if (f.petId && String(a.petId) !== f.petId) return false;
        if (f.doctorName && a.doctorName !== f.doctorName) return false;
        if (f.date && toIsoDay(a.appointmentDate) !== f.date) return false;
        if (f.search) {
          const q = f.search.toLowerCase();
          const hay = `${a.petName} ${a.doctorName} ${a.petBreed || ""} ${a.reason || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    },
    [appliedFilters],
  );

  const upcoming = useMemo(
    () =>
      applyFilters(
        appointments.filter(
          (a) => a.status === "Confirmed" || a.status === "Pending",
        ),
      ),
    [appointments, applyFilters],
  );

  const past = useMemo(
    () => applyFilters(appointments.filter((a) => a.status === "Completed")),
    [appointments, applyFilters],
  );

  const cancelled = useMemo(
    () => applyFilters(appointments.filter((a) => a.status === "Cancelled")),
    [appointments, applyFilters],
  );

  // unique doctor names from all appointments
  const doctorNames = useMemo(
    () => [...new Set(appointments.map((a) => a.doctorName))].sort(),
    [appointments],
  );

  // ── handlers ──
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setUpcomingPage(1);
    setPastPage(1);
    setCancelledPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCancel = (id: number) => {
    setCancelTargetId(id);
  };

  const handleConfirmCancel = async () => {
    if (cancelTargetId === null) return;
    setIsCancelling(true);
    try {
      await apiFetch(`/api/appointments/${cancelTargetId}/cancel`, { method: "PATCH" });
    } catch {
      // Optimistically update even if endpoint is unavailable
    }
    // Optimistically move appointment to Cancelled in local state
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === cancelTargetId ? { ...a, status: "Cancelled" } : a,
      ),
    );
    setCancelTargetId(null);
    setIsCancelling(false);
    setActiveTab("cancelled");
  };

  const handleCloseCancelModal = () => {
    if (!isCancelling) setCancelTargetId(null);
  };

  const handleReschedule = (id: number) => {
    const apt = appointments.find((a) => a.id === id);
    setRescheduleTarget({ id, petName: apt?.petName || "Pet" });
  };

  // ── render ──
  if (loading) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500">Loading appointments…</span>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto flex max-w-6xl flex-col px-6 py-6">
        {/* Header */}
        <AppointmentsHeader onSchedule={() => setIsBookingModalOpen(true)} />

        {/* Tabs + Filters Card */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <AppointmentsTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            upcomingCount={upcoming.length}
          />

          <div className="mt-5">
            <AppointmentsFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
              pets={pets.map((p) => ({ id: p.id, name: p.name }))}
              doctors={doctorNames}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Lists */}
        {activeTab === "upcoming" && (
          <AppointmentsList
            title="Upcoming Appointments"
            appointments={upcoming}
            variant="upcoming"
            page={upcomingPage}
            pageSize={PAGE_SIZE}
            onPageChange={setUpcomingPage}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        )}

        {activeTab === "upcoming" && past.length > 0 && (
          <AppointmentsList
            title="Past Appointments"
            appointments={past}
            variant="past"
            page={pastPage}
            pageSize={PAGE_SIZE}
            onPageChange={setPastPage}
          />
        )}

        {activeTab === "past" && (
          <AppointmentsList
            title="Past Appointments"
            appointments={past}
            variant="past"
            page={pastPage}
            pageSize={PAGE_SIZE}
            onPageChange={setPastPage}
          />
        )}

        {activeTab === "cancelled" && (
          <AppointmentsList
            title="Cancelled Appointments"
            appointments={cancelled}
            variant="cancelled"
            page={cancelledPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCancelledPage}
          />
        )}
      </main>

      {/* Booking modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          loadData(); // refresh after potential booking
        }}
      />

      {/* Cancel confirmation modal */}
      <CancelConfirmModal
        isOpen={cancelTargetId !== null}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseCancelModal}
        isCancelling={isCancelling}
      />

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <RescheduleModal
          appointmentId={rescheduleTarget.id}
          petName={rescheduleTarget.petName}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={() => {
            setRescheduleTarget(null);
            loadData();
          }}
        />
      )}
    </>
  );
}
