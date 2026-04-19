"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch, getPetImageUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Pet } from "@/types/pet";

interface VaccinationRecord {
  id: number;
  petId: number;
  vaccineName: string;
  givenAt: string;
  validUntil: string | null;
  notes: string | null;
  givenByStaffId: number;
  givenByStaffName: string;
  createdAt: string;
}

interface PrescriptionItemRecord {
  id: number;
  medicineId: number | null;
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  quantity: number;
  instructions: string | null;
}

interface PrescriptionRecord {
  id: number;
  petId: number;
  prescribedAt: string;
  diagnosis: string | null;
  notes: string | null;
  prescribedByStaffId: number;
  prescribedByStaffName: string;
  createdAt: string;
  items: PrescriptionItemRecord[];
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
};

export default function PetRecordShell() {
  const { user, loading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);

  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    const loadPets = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Pet[]>("/api/pets");
        setPets(data);
        if (data.length > 0) {
          setSelectedPetId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load pets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [user, authLoading]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || pets[0];
  const resolvedSelectedPetId = selectedPetId ?? pets[0]?.id ?? null;

  useEffect(() => {
    if (!user || authLoading || resolvedSelectedPetId == null) {
      return;
    }

    let isActive = true;

    const loadRecords = async () => {
      setRecordsLoading(true);
      setRecordsError(null);

      try {
        const [vaccinationData, prescriptionData] = await Promise.all([
          apiFetch<VaccinationRecord[]>(`/api/pets/${resolvedSelectedPetId}/vaccinations`),
          apiFetch<PrescriptionRecord[]>(`/api/pets/${resolvedSelectedPetId}/prescriptions`),
        ]);

        if (!isActive) return;

        setVaccinations(vaccinationData);
        setPrescriptions(prescriptionData);
      } catch (error) {
        if (!isActive) return;

        console.error("Failed to load medical records:", error);
        setVaccinations([]);
        setPrescriptions([]);
        setRecordsError("Failed to load vaccination and prescription records.");
      } finally {
        if (isActive) {
          setRecordsLoading(false);
        }
      }
    };

    loadRecords();

    return () => {
      isActive = false;
    };
  }, [user, authLoading, resolvedSelectedPetId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading pets...</div>
        </div>
      </main>
    );
  }

  if (pets.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">No pets found. Please add a pet first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Record</h1>
          <p className="mt-1 text-sm text-gray-600">View your pet vaccination and prescription history</p>
        </div>

        <div className="relative">
          <label className="mb-2 block text-xs font-medium text-gray-500">Select Pet</label>
          <div className="relative">
            <select
              value={resolvedSelectedPetId ?? ""}
              onChange={(e) => setSelectedPetId(Number(e.target.value))}
              className="w-48 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Patient Information</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              {getPetImageUrl(selectedPet.imageUrl) ? (
                <Image src={getPetImageUrl(selectedPet.imageUrl)!} alt={selectedPet.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-bold text-blue-500">
                  {selectedPet.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedPet.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedPet.species}
                {selectedPet.breed ? ` · ${selectedPet.breed}` : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="text-xs font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Species</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.species}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Breed</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.breed || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Age</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.age ? `${selectedPet.age} years` : "N/A"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Vaccinations</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {recordsLoading ? <div className="px-6 py-8 text-sm text-gray-600">Loading records...</div> : null}
          {!recordsLoading && recordsError ? <div className="px-6 py-8 text-sm text-red-700">{recordsError}</div> : null}
          {!recordsLoading && !recordsError && vaccinations.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-600">No vaccination records found for this pet.</div>
          ) : null}
          {!recordsLoading && !recordsError && vaccinations.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Date Given</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Vaccine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Given By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vaccinations.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDateTime(record.givenAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.vaccineName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(record.validUntil)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.givenByStaffName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Prescriptions</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {recordsLoading ? <div className="px-6 py-8 text-sm text-gray-600">Loading records...</div> : null}
          {!recordsLoading && recordsError ? <div className="px-6 py-8 text-sm text-red-700">{recordsError}</div> : null}
          {!recordsLoading && !recordsError && prescriptions.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-600">No prescription records found for this pet.</div>
          ) : null}
          {!recordsLoading && !recordsError && prescriptions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Prescribed At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Diagnosis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Medicines</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="align-top hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDateTime(prescription.prescribedAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prescription.prescribedByStaffName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prescription.diagnosis || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {prescription.items.length === 0 ? (
                        <span>-</span>
                      ) : (
                        <div className="space-y-2">
                          {prescription.items.map((item) => (
                            <div key={item.id}>
                              <p className="font-medium">{item.medicineName}</p>
                              <p className="text-xs text-gray-600">
                                {item.dosage} | {item.frequency} | {item.durationDays} day(s) | Qty: {item.quantity}
                              </p>
                              {item.instructions ? (
                                <p className="text-xs text-gray-600">Instructions: {item.instructions}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prescription.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>
    </main>
  );
}
