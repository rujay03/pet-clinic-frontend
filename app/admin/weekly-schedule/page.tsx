"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiFetch } from "@/lib/api";

type DoctorSummary = {
  id: number;
  name: string;
};

type WeeklyScheduleItem = {
  scheduleId: number;
  doctorId: number | null;
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
};

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function toInputTime(value: string) {
  return value.slice(0, 5);
}

function normalizeInputTime(value: string | null): string | null {
  if (!value) return null;
  const safe = value.trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(safe)) return null;
  return `${safe}:00`;
}

function format24hTo12h(value: string) {
  const [hoursText, minutesText] = value.split(":");
  let hours = Number(hoursText);
  const period = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, "0")}:${minutesText} ${period}`;
}

function formatDay(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export default function AdminWeeklySchedulePage() {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [items, setItems] = useState<WeeklyScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    const response = await apiFetch<DoctorSummary[]>("/api/admin/appointments/doctors");
    setDoctors(response);
    setSelectedDoctorId((prev) => prev ?? response[0]?.id ?? null);
  };

  const fetchSchedules = async (doctorId: number | null) => {
    if (!doctorId) {
      setItems([]);
      return;
    }
    const response = await apiFetch<WeeklyScheduleItem[]>(`/api/admin/appointments/weekly-schedules?doctorId=${doctorId}`);
    setItems(response);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchDoctors();
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchSchedules(selectedDoctorId);
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDoctorId]);

  const addWeeklySlot = async () => {
    if (!selectedDoctorId) return;
    const day = window.prompt("Day (MONDAY-SUNDAY)", "MONDAY")?.toUpperCase();
    if (!day || !DAYS_OF_WEEK.includes(day)) return;
    const start = normalizeInputTime(window.prompt("Start (HH:mm)", "09:00"));
    const end = normalizeInputTime(window.prompt("End (HH:mm)", "10:00"));
    if (!start || !end) return;

    try {
      await apiFetch("/api/admin/appointments/weekly-schedules", {
        method: "POST",
        body: { doctorId: selectedDoctorId, dayOfWeek: day, startTime: start, endTime: end },
      });
      await fetchSchedules(selectedDoctorId);
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  };

  const deleteWeeklySlot = async (scheduleId: number) => {
    try {
      await apiFetch(`/api/admin/appointments/weekly-schedules/${scheduleId}`, { method: "DELETE" });
      await fetchSchedules(selectedDoctorId);
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  };

  const editWeeklySlot = async (item: WeeklyScheduleItem) => {
    const start = normalizeInputTime(window.prompt("Start (HH:mm)", toInputTime(item.startTime)));
    const end = normalizeInputTime(window.prompt("End (HH:mm)", toInputTime(item.endTime)));
    if (!start || !end) return;
    try {
      await apiFetch(`/api/admin/appointments/weekly-schedules/${item.scheduleId}`, { method: "DELETE" });
      await apiFetch("/api/admin/appointments/weekly-schedules", {
        method: "POST",
        body: { doctorId: selectedDoctorId, dayOfWeek: item.dayOfWeek, startTime: start, endTime: end },
      });
      await fetchSchedules(selectedDoctorId);
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#f5f4fb] p-6 text-[#1f2a59]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Weekly Doctor Schedule</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin/appointments" className="rounded-lg border px-3 py-2 text-sm">Back to Appointments</Link>
              <button onClick={logout} className="rounded-lg border px-3 py-2 text-sm">Logout</button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <select
              value={selectedDoctorId ?? ""}
              onChange={(e) => setSelectedDoctorId(e.target.value ? Number(e.target.value) : null)}
              className="h-10 rounded-lg border px-3"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>

            <button onClick={addWeeklySlot} disabled={!selectedDoctorId} className="rounded-lg bg-[#2f67ff] px-3 py-2 text-sm text-white disabled:opacity-60">
              Add Weekly Slot
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-[#7a86ae]">Loading...</div>
          ) : error ? (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-[#d24b72]">{error}</div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-[#7a86ae]">No weekly schedule rows found.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-white">
              {items.map((item, index) => (
                <div key={item.scheduleId} className={`flex items-center justify-between px-4 py-3 ${index ? "border-t" : ""}`}>
                  <div>
                    <p className="font-medium">{formatDay(item.dayOfWeek)} - {format24hTo12h(toInputTime(item.startTime))} to {format24hTo12h(toInputTime(item.endTime))}</p>
                    <p className="text-xs text-[#7a86ae]">{item.doctorName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editWeeklySlot(item)} className="rounded border px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => deleteWeeklySlot(item.scheduleId)} className="rounded border px-3 py-1 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

