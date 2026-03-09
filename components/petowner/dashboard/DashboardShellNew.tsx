"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch, getPetImageUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Pet } from "@/types/pet";
import type {
  DashboardStats,
  DashboardPet,
  DashboardAppointment,
  DashboardPrescription,
  DashboardNotification,
  BillingHistoryItem,
} from "@/types/dashboard";
import Link from "next/link";
import Image from "next/image";

// Helper function to get pet avatar based on species
const getPetAvatar = (species: string, name: string) => {
  const initial = name.charAt(0).toUpperCase();
  const bgColors: Record<string, string> = {
    DOG: "bg-amber-100",
    CAT: "bg-blue-100",
    BIRD: "bg-green-100",
    default: "bg-gray-100",
  };
  const bgColor = bgColors[species.toUpperCase()] || bgColors.default;
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
      <span className="text-lg font-semibold text-gray-700">{initial}</span>
    </div>
  );
};

// Stats Card Component
function StatsCard({
  label,
  value,
  icon,
  borderColor = "border-blue-500",
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  borderColor?: string;
}) {
  return (
    <div className={`flex items-center justify-between rounded-lg border-l-4 ${borderColor} bg-white p-4 shadow-sm`}>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
}

// Pet Card Component
function PetCard({
  pet,
  onViewHistory,
  onBookAppointment,
}: {
  pet: DashboardPet;
  onViewHistory: () => void;
  onBookAppointment: () => void;
}) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Valid: "bg-green-100 text-green-700",
      "Due Soon": "bg-orange-100 text-orange-700",
      Overdue: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.Valid;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {getPetImageUrl(pet.imageUrl) ? (
          <Image
            src={getPetImageUrl(pet.imageUrl)!}
            alt={pet.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          getPetAvatar(pet.species, pet.name)
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{pet.breed || pet.species}</p>
          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
            <span>Age {pet.age || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onViewHistory}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View History
        </button>
        <button
          onClick={onBookAppointment}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment
        </button>
      </div>
    </div>
  );
}

// Appointment Row Component
function AppointmentRow({ appointment }: { appointment: DashboardAppointment }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
            <span className="text-xs font-medium text-amber-700">{appointment.petName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{appointment.petName}</p>
            <p className="text-xs text-gray-500">{appointment.doctorName}</p>
          </div>
        </div>
      </td>
      <td className="py-3 text-sm text-gray-600">{appointment.doctorName}</td>
      <td className="py-3">
        <p className="text-sm text-gray-900">{formatDate(appointment.date)}</p>
        <p className="text-xs text-gray-500">{appointment.time} ✏️</p>
      </td>
    </tr>
  );
}

// Prescription Row Component
function PrescriptionRow({ prescription }: { prescription: DashboardPrescription }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 text-sm font-medium text-gray-900">{prescription.petName}</td>
      <td className="py-3 text-sm text-gray-600">{prescription.medication}</td>
      <td className="py-3 text-sm text-gray-600">
        <div>
          <p>{prescription.dosage}</p>
          <p className="text-xs text-gray-400">{prescription.frequency}</p>
        </div>
      </td>
      <td className="py-3">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          prescription.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          ● {prescription.status}
        </span>
      </td>
    </tr>
  );
}

// Notification Item Component
function NotificationItem({ notification }: { notification: DashboardNotification }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        );
      case "appointment":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case "prescription":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (timestamp: string) => {
    // Simple relative time
    return timestamp;
  };

  return (
    <div className="flex items-start gap-3 py-3">
      {getIcon(notification.type)}
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{notification.title}</span> {notification.message}
        </p>
        {notification.type === "prescription" && (
          <p className="text-xs text-blue-600 hover:underline cursor-pointer">View details.</p>
        )}
      </div>
      <span className="text-xs text-gray-400">{formatTime(notification.timestamp)}</span>
    </div>
  );
}

// Billing History Row Component
function BillingRow({ item }: { item: BillingHistoryItem }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 text-sm text-gray-600">{formatDate(item.date)}</td>
      <td className="py-3 text-sm font-medium text-gray-900">{item.petName}</td>
      <td className="py-3 text-sm text-gray-600">{item.services}</td>
      <td className="py-3 text-sm font-semibold text-gray-900">${item.amount}</td>
    </tr>
  );
}

export default function DashboardShell() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<DashboardPet[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPets: 0,
    upcomingAppointments: 0,
    pendingPayments: 0,
    activePrescriptions: 0,
    upcomingVaccinations: 0,
  });
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<DashboardPrescription[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);

  const loadDashboardData = useCallback(async () => {
    // Don't load data if user is not authenticated or still loading auth
    if (!user || authLoading) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load pets from API
      const petsData = await apiFetch<Pet[]>("/api/pets");

      // Transform pets data for dashboard
      const dashboardPets: DashboardPet[] = petsData.map((pet) => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        lastVisit: undefined, // Will be populated when we have visit data
        vaccinationStatus: "Valid" as const, // Default, will be updated with real data
        rabiesStatus: undefined,
        imageUrl: pet.imageUrl, // pass through the actual image URL from API
      }));

      setPets(dashboardPets);

      // Calculate stats from real data
      setStats({
        totalPets: petsData.length,
        upcomingAppointments: 0, // Will be populated when appointment API is available
        pendingPayments: 0, // Will be populated when payment API is available
        activePrescriptions: 0, // Will be populated when prescription API is available
        upcomingVaccinations: 0, // Will be populated when vaccination API is available
      });

      // Try to load appointments if endpoint exists
      try {
        const appointmentsData = await apiFetch<any[]>("/api/appointments/my");
        const dashboardAppointments: DashboardAppointment[] = appointmentsData.map((apt) => ({
          id: apt.id,
          petId: apt.petId,
          petName: apt.petName || "Unknown",
          doctorName: apt.doctorName || "Dr. Unknown",
          date: apt.appointmentDate || apt.date,
          time: apt.appointmentTime || apt.time,
          status: apt.status || "Pending",
          price: apt.price,
        }));
        setAppointments(dashboardAppointments);
        setStats((prev) => ({ ...prev, upcomingAppointments: dashboardAppointments.length }));
      } catch {
        // Appointment endpoint not available yet
        setAppointments([]);
      }

      // Try to load prescriptions if endpoint exists
      try {
        const prescriptionsData = await apiFetch<any[]>("/api/prescriptions/my");
        const dashboardPrescriptions: DashboardPrescription[] = prescriptionsData.map((p) => ({
          id: p.id,
          petId: p.petId,
          petName: p.petName || "Unknown",
          medication: p.medication || p.medicineName,
          dosage: p.dosage,
          frequency: p.frequency,
          status: p.status || "Active",
        }));
        setPrescriptions(dashboardPrescriptions);
        setStats((prev) => ({
          ...prev,
          activePrescriptions: dashboardPrescriptions.filter((p) => p.status === "Active").length,
        }));
      } catch {
        // Prescription endpoint not available yet
        setPrescriptions([]);
      }

      // Try to load notifications if endpoint exists
      try {
        const notificationsData = await apiFetch<any[]>("/api/notifications/my");
        const dashboardNotifications: DashboardNotification[] = notificationsData.map((n) => ({
          id: n.id,
          type: n.type || "appointment",
          title: n.title,
          message: n.message,
          timestamp: n.timestamp || n.createdAt,
          read: n.read || false,
        }));
        setNotifications(dashboardNotifications);
      } catch {
        // Notification endpoint not available yet
        setNotifications([]);
      }

      // Try to load billing history if endpoint exists
      try {
        const billingData = await apiFetch<any[]>("/api/billing/my");
        const dashboardBilling: BillingHistoryItem[] = billingData.map((b) => ({
          id: b.id,
          date: b.date || b.createdAt,
          petName: b.petName,
          services: b.services || b.description,
          amount: b.amount || b.total,
          status: b.status || "Paid",
        }));
        setBillingHistory(dashboardBilling);
        setStats((prev) => ({
          ...prev,
          pendingPayments: dashboardBilling.filter((b) => b.status === "Pending").length,
        }));
      } catch {
        // Billing endpoint not available yet
        setBillingHistory([]);
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // If it's an auth error (401/403), user will be redirected by ProtectedRoute
      // Just set loading to false and let the component unmount
      if (error instanceof Error && error.message.includes("login")) {
        // Auth error - component will be unmounted by ProtectedRoute redirect
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleViewHistory = (petId: number) => {
    window.location.href = `/petowner/records?petId=${petId}`;
  };

  const handleBookAppointment = () => {
    window.location.href = "/petowner/appointments";
  };

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  // Return null if user is not authenticated (ProtectedRoute will handle redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        {/* Page header */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your pets and upcoming clinic activity.
          </p>
        </header>

        {/* Stats Row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            label="Total Pets"
            value={stats.totalPets}
            borderColor="border-blue-500"
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Upcoming Appointments"
            value={stats.upcomingAppointments}
            borderColor="border-blue-500"
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            label="Pending Payments"
            value={stats.pendingPayments}
            borderColor="border-orange-500"
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Active Prescriptions"
            value={stats.activePrescriptions}
            borderColor="border-purple-500"
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <StatsCard
            label="Upcoming Vaccinations"
            value={stats.upcomingVaccinations}
            borderColor="border-green-500"
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - My Pets */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Pets</h2>
              </div>

              {pets.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No pets added yet.</p>
                  <Link
                    href="/petowner/pets"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add your first pet
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      onViewHistory={() => handleViewHistory(pet.id)}
                      onBookAppointment={handleBookAppointment}
                    />
                  ))}
                </div>
              )}

              <Link
                href="/petowner/pets"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Pet
              </Link>
            </div>

            {/* Active Prescriptions - Small version for mobile */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Prescriptions</h2>
                <Link href="/petowner/records" className="text-sm text-blue-600 hover:text-blue-700">
                  View All &gt;
                </Link>
              </div>
              {prescriptions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No active prescriptions.</p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.slice(0, 2).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <span className="text-xs font-medium text-amber-700">{p.petName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.petName}</p>
                          <p className="text-xs text-gray-500">{p.medication}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">${50}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Appointments & Prescriptions */}
          <div className="lg:col-span-1">
            {/* Upcoming Appointments */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              </div>

              {appointments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No upcoming appointments.</p>
                  <Link
                    href="/petowner/appointments"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                  >
                    Book an appointment
                  </Link>
                </div>
              ) : (
                <>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                        <th className="pb-2">Pet</th>
                        <th className="pb-2">Doctor</th>
                        <th className="pb-2">Date &amp; Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 3).map((apt) => (
                        <AppointmentRow key={apt.id} appointment={apt} />
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <Link
                href="/petowner/appointments"
                className="mt-3 flex items-center justify-end text-sm text-blue-600 hover:text-blue-700"
              >
                View All &gt;
              </Link>
            </div>

            {/* Active Prescriptions */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Prescriptions</h2>
              </div>

              {prescriptions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No active prescriptions.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                      <th className="pb-2">Pet</th>
                      <th className="pb-2">Medication</th>
                      <th className="pb-2">Dosage</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.slice(0, 3).map((p) => (
                      <PrescriptionRow key={p.id} prescription={p} />
                    ))}
                  </tbody>
                </table>
              )}

              <Link
                href="/petowner/records"
                className="mt-3 flex items-center justify-end text-sm text-blue-600 hover:text-blue-700"
              >
                View All &gt;
              </Link>
            </div>
          </div>

          {/* Right Column - Alerts & Billing */}
          <div className="lg:col-span-1">
            {/* Alerts & Notifications */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Alerts &amp; Notifications</h2>
              </div>

              {notifications.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No new notifications.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.slice(0, 3).map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )}

              <button className="mt-3 flex w-full items-center justify-end text-sm text-blue-600 hover:text-blue-700">
                View All &gt;
              </button>
            </div>

            {/* Billing History */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
              </div>

              {billingHistory.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No billing history.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Pet</th>
                      <th className="pb-2">Services</th>
                      <th className="pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.slice(0, 3).map((item) => (
                      <BillingRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              )}

              <button className="mt-3 flex w-full items-center justify-end text-sm text-blue-600 hover:text-blue-700">
                View All &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

