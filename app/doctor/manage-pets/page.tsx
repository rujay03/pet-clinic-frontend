// app/doctor/manage-pets/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, getPetImageUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TopNavBar from "@/components/doctor/TopNavBar";
import AddPetOwnerModal from "@/components/doctor/AddPetOwnerModal";
import AddPetModal from "@/components/doctor/AddPetModal";
import AddVaccinationModal from "@/components/doctor/AddVaccinationModal";
import CreatePrescriptionModal from "@/components/doctor/CreatePrescriptionModal";

interface PetOwner {
  id: number;
  name: string;
  email: string | null;
  address: string | null;
  telephone: string | null;
}

interface PetApiResponse {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  age: number | null;
  notes: string | null;
  imageUrl: string | null;
  dateOfBirth: string | null;
}

interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: string;
  breed: string;
  ageLabel: string;
  gender: string;
  weightKg: number | null;
  image: string;
  notes: string | null;
}

interface Vaccination {
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

interface PrescriptionItem {
  id: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  quantity: number;
  instructions: string | null;
}

interface Prescription {
  id: number;
  petId: number;
  prescribedAt: string;
  diagnosis: string | null;
  notes: string | null;
  prescribedByStaffId: number;
  prescribedByStaffName: string;
  createdAt: string;
  items: PrescriptionItem[];
}

const getAgeLabel = (age?: number | null) => {
  if (age == null) {
    return "Unknown age";
  }
  return `${age} year${age === 1 ? "" : "s"}`;
};

const getGenderLabel = (sex?: string | null) => {
  const normalized = (sex ?? "").toUpperCase();
  if (normalized === "MALE") return "Male";
  if (normalized === "FEMALE") return "Female";
  return "Unknown";
};

const getFallbackImage = (species: string) => {
  return species.toLowerCase() === "cat" ? "/cat-image.png" : "/dog.png";
};

const mapPetFromApi = (pet: PetApiResponse, ownerId: number): Pet => {
  return {
    id: pet.id,
    ownerId,
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "Unknown breed",
    ageLabel: getAgeLabel(pet.age),
    gender: getGenderLabel(pet.sex),
    weightKg: null,
    image: getPetImageUrl(pet.imageUrl) ?? getFallbackImage(pet.species),
    notes: pet.notes,
  };
};

const normalizeDateTimeLocal = (value: string) => {
  return value.length === 16 ? `${value}:00` : value;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
};

export default function ManagePetsPage() {
  const { user } = useAuth();

  const [petOwners, setPetOwners] = useState<PetOwner[]>([]);
  const [ownerPets, setOwnerPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ownerFetchError, setOwnerFetchError] = useState<string | null>(null);
  const [petsFetchError, setPetsFetchError] = useState<string | null>(null);
  const [petDetailsError, setPetDetailsError] = useState<string | null>(null);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petDetailsLoading, setPetDetailsLoading] = useState(false);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [recordSaveError, setRecordSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"vaccinations" | "prescriptions">("vaccinations");
  const [selectedOwner, setSelectedOwner] = useState<PetOwner | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const filteredPetOwners = useMemo(
    () =>
      petOwners.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (owner.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (owner.telephone ?? "").includes(searchQuery)
      ),
    [petOwners, searchQuery]
  );

  const selectedPet = useMemo(() => {
    if (selectedPetId == null) {
      return null;
    }
    return ownerPets.find((pet) => pet.id === selectedPetId) ?? null;
  }, [ownerPets, selectedPetId]);

  const handleSelectOwner = (owner: PetOwner) => {
    setSelectedOwner(owner);
    setSelectedPetId(null);
    setOwnerPets([]);
    setVaccinations([]);
    setPrescriptions([]);
    setRecordsError(null);
    setRecordSaveError(null);
    setPetsFetchError(null);
    setPetDetailsError(null);
  };

  const handleAddPetOwner = async (newOwner: Omit<PetOwner, "id">) => {
    try {
      const createdOwner = await apiFetch<PetOwner>("/api/pet-owner", {
        method: "POST",
        body: {
          fullName: newOwner.name,
          email: newOwner.email,
          contactNo: newOwner.telephone,
          address: newOwner.address,
        },
      });

      setPetOwners((prev) => [...prev, createdOwner]);
      setSelectedOwner(createdOwner);
      setSelectedPetId(null);
      setOwnerPets([]);
      setVaccinations([]);
      setPrescriptions([]);
      setRecordsError(null);
      setRecordSaveError(null);
      setShowAddOwnerModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add pet owner";
      throw new Error(message);
    }
  };

  const handleAddPet = async (newPet: {
    name: string;
    species: string;
    breed: string;
    gender: string;
    dateOfBirth: string;
  }) => {
    if (!selectedOwner) {
      throw new Error("Select an owner first");
    }

    try {
      const createdPet = await apiFetch<PetApiResponse>(`/api/pets/owner/${selectedOwner.id}`, {
        method: "POST",
        body: {
          name: newPet.name,
          species: newPet.species,
          breed: newPet.breed,
          sex: newPet.gender.toUpperCase(),
          dateOfBirth: newPet.dateOfBirth,
          notes: null,
        },
      });

      const mappedPet = mapPetFromApi(createdPet, selectedOwner.id);
      setOwnerPets((prev) => [...prev, mappedPet]);
      setSelectedPetId(mappedPet.id);
      setVaccinations([]);
      setPrescriptions([]);
      setRecordsError(null);
      setRecordSaveError(null);
      setShowAddPetModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add pet";
      throw new Error(message);
    }
  };

  const handleCreateVaccination = async (payload: {
    vaccineName: string;
    givenAt: string;
    validUntil: string;
    notes: string;
  }) => {
    if (!selectedPet) {
      return;
    }

    setRecordSaveError(null);

    try {
      const created = await apiFetch<Vaccination>(`/api/pets/${selectedPet.id}/vaccinations`, {
        method: "POST",
        body: {
          vaccineName: payload.vaccineName,
          givenAt: normalizeDateTimeLocal(payload.givenAt),
          validUntil: payload.validUntil || null,
          notes: payload.notes || null,
        },
      });

      setVaccinations((prev) => [created, ...prev]);
      setActiveTab("vaccinations");
      setShowVaccinationModal(false);
    } catch {
      setRecordSaveError("Failed to save vaccination record.");
      throw new Error("Failed to save vaccination");
    }
  };

  const handleCreatePrescription = async (payload: {
    prescribedAt: string;
    diagnosis: string;
    notes: string;
    items: {
      medicineId: number;
      dosage: string;
      frequency: string;
      durationDays: number;
      quantity: number;
      instructions: string;
    }[];
  }) => {
    if (!selectedPet) {
      return;
    }

    setRecordSaveError(null);

    try {
      const created = await apiFetch<Prescription>(`/api/pets/${selectedPet.id}/prescriptions`, {
        method: "POST",
        body: {
          prescribedAt: normalizeDateTimeLocal(payload.prescribedAt),
          diagnosis: payload.diagnosis || null,
          notes: payload.notes || null,
          items: payload.items.map((item) => ({
            medicineId: item.medicineId,
            dosage: item.dosage,
            frequency: item.frequency,
            durationDays: item.durationDays,
            quantity: item.quantity,
            instructions: item.instructions || null,
          })),
        },
      });

      setPrescriptions((prev) => [created, ...prev]);
      setActiveTab("prescriptions");
      setShowPrescriptionModal(false);
    } catch {
      setRecordSaveError("Failed to save prescription.");
      throw new Error("Failed to save prescription");
    }
  };

  const escapeHtml = (value?: string | null) => {
    if (!value) return "-";
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const buildPrescriptionReceiptHtml = (prescription: Prescription) => {
    const itemRows = prescription.items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.medicineName)}</td>
            <td>${escapeHtml(item.dosage)}</td>
            <td>${escapeHtml(item.frequency)}</td>
            <td>${item.durationDays}</td>
            <td>${item.quantity}</td>
            <td>${escapeHtml(item.instructions)}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Prescription Receipt #${prescription.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1 { margin: 0 0 6px; font-size: 24px; }
            h2 { margin: 18px 0 8px; font-size: 16px; }
            p { margin: 4px 0; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; font-size: 13px; }
            th { background: #f3f4f6; text-align: left; }
            .footer { margin-top: 28px; display: flex; justify-content: space-between; }
            .line { margin-top: 32px; border-top: 1px solid #9ca3af; width: 220px; padding-top: 6px; font-size: 12px; }
            @media print { body { margin: 14px; } }
          </style>
        </head>
        <body>
          <h1>Prescription Receipt</h1>
          <p>Receipt No: #${prescription.id}</p>

          <div class="meta">
            <p><strong>Prescribed At:</strong> ${escapeHtml(formatDateTime(prescription.prescribedAt))}</p>
            <p><strong>Doctor:</strong> ${escapeHtml(prescription.prescribedByStaffName)}</p>
            <p><strong>Pet:</strong> ${escapeHtml(selectedPet?.name)}</p>
            <p><strong>Owner:</strong> ${escapeHtml(selectedOwner?.name)}</p>
          </div>

          <h2>Clinical Notes</h2>
          <p><strong>Diagnosis:</strong> ${escapeHtml(prescription.diagnosis)}</p>
          <p><strong>Prescription Notes:</strong> ${escapeHtml(prescription.notes)}</p>

          <h2>Medicines</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration (days)</th>
                <th>Quantity</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows || '<tr><td colspan="7">No medicine items</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            <div class="line">Doctor Signature</div>
            <div class="line">Date</div>
          </div>
        </body>
      </html>
    `;
  };

  const printWithIframe = (html: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;

    if (!doc || !win) {
      document.body.removeChild(iframe);
      return false;
    }

    doc.open();
    doc.write(html);
    doc.close();

    // Print after the iframe document is ready to avoid blank pages.
    win.onload = () => {
      win.focus();
      win.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 500);
    };

    return true;
  };

  const handlePrintPrescription = (prescription: Prescription) => {
    if (!selectedPet || !selectedOwner) {
      return;
    }

    setRecordSaveError(null);
    const html = buildPrescriptionReceiptHtml(prescription);

    if (printWithIframe(html)) {
      return;
    }

    // Fallback for browsers that restrict iframe printing.
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      setRecordSaveError("Unable to print receipt. Please allow pop-ups, then try again.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    const loadOwners = async () => {
      setOwnersLoading(true);
      setOwnerFetchError(null);

      try {
        const owners = await apiFetch<PetOwner[]>("/api/pet-owner/list");

        if (!isActive) {
          return;
        }

        setPetOwners(owners);

        if (owners.length === 0) {
          setSelectedOwner(null);
          setSelectedPetId(null);
          setOwnerPets([]);
          return;
        }

        const currentOwner = selectedOwner
          ? owners.find((owner) => owner.id === selectedOwner.id)
          : null;
        setSelectedOwner(currentOwner ?? owners[0]);
      } catch {
        if (!isActive) {
          return;
        }

        setPetOwners([]);
        setSelectedOwner(null);
        setSelectedPetId(null);
        setOwnerPets([]);
        setOwnerFetchError("Failed to load pet owners from database.");
      } finally {
        if (isActive) {
          setOwnersLoading(false);
        }
      }
    };

    loadOwners();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedOwner) {
      return;
    }

    let isActive = true;

    const loadPetsForOwner = async () => {
      setPetsLoading(true);
      setPetsFetchError(null);
      setPetDetailsError(null);
      setOwnerPets([]);
      setSelectedPetId(null);

      try {
        const pets = await apiFetch<PetApiResponse[]>(`/api/pets/owner/${selectedOwner.id}`);

        if (!isActive) {
          return;
        }

        const mappedPets = pets.map((pet) => mapPetFromApi(pet, selectedOwner.id));
        setOwnerPets(mappedPets);

        if (mappedPets.length > 0) {
          setSelectedPetId(mappedPets[0].id);
        }
      } catch {
        if (!isActive) {
          return;
        }

        setOwnerPets([]);
        setSelectedPetId(null);
        setPetsFetchError("Failed to load pets for the selected owner.");
      } finally {
        if (isActive) {
          setPetsLoading(false);
        }
      }
    };

    loadPetsForOwner();

    return () => {
      isActive = false;
    };
    }, [user, selectedOwner?.id]);

    useEffect(() => {
    if (!user || !selectedOwner || selectedPetId == null) {
      return;
    }

    let isActive = true;

    const loadPetDetails = async () => {
      setPetDetailsLoading(true);
      setPetDetailsError(null);

      try {
        const pet = await apiFetch<PetApiResponse>(`/api/pets/details/${selectedPetId}`);

        if (!isActive) {
          return;
        }

        const mappedPet = mapPetFromApi(pet, selectedOwner.id);
        setOwnerPets((prev) => {
          const exists = prev.some((item) => item.id === mappedPet.id);
          if (!exists) {
            return [...prev, mappedPet];
          }

          return prev.map((item) => (item.id === mappedPet.id ? mappedPet : item));
        });
      } catch {
        if (!isActive) {
          return;
        }

        setPetDetailsError("Failed to load selected pet details.");
      } finally {
        if (isActive) {
          setPetDetailsLoading(false);
        }
      }
    };

    loadPetDetails();

    return () => {
      isActive = false;
    };
    }, [user, selectedOwner, selectedPetId]);

    useEffect(() => {
    if (!user || !selectedOwner || selectedPetId == null) {
      return;
    }

    let isActive = true;

    const loadRecords = async () => {
      setRecordsLoading(true);
      setRecordsError(null);

      try {
        const [vaccinationData, prescriptionData] = await Promise.all([
          apiFetch<Vaccination[]>(`/api/pets/${selectedPetId}/vaccinations`),
          apiFetch<Prescription[]>(`/api/pets/${selectedPetId}/prescriptions`),
        ]);

        if (!isActive) {
          return;
        }

        setVaccinations(vaccinationData);
        setPrescriptions(prescriptionData);
      } catch {
        if (!isActive) {
          return;
        }

        setVaccinations([]);
        setPrescriptions([]);
        setRecordsError("Failed to load medical records for selected pet.");
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
    }, [user, selectedOwner, selectedPetId]);

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-[#EDEAF4]">
        <TopNavBar userEmail={user.email} />

        <main className="mx-auto w-full max-w-[1400px] px-6 py-7">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-[#22195E]">Manage Pets</h1>
            <p className="mt-1 text-2xl text-[#59529A]">
              Manage pet owners and their pets
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.95fr]">
            <section className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[320px] flex-1">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5d618c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search pet owners..."
                    className="h-14 w-full rounded-xl border border-[#c7c8e1] bg-[#efedf8] pl-12 pr-4 text-xl text-[#3f4477] placeholder:text-[#767ca8] focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowAddOwnerModal(true)}
                  className="flex h-14 items-center gap-2 rounded-xl bg-gradient-to-r from-[#544DFF] to-[#3F47DF] px-5 text-xl font-medium text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.3}
                      d="M12 5v14m7-7H5"
                    />
                  </svg>
                  Add Pet Owner
                </button>
              </div>

              <div className="rounded-2xl border border-[#cccee3] bg-white px-5 py-4 shadow-sm">
                <h2 className="text-[40px] font-semibold text-[#1a1f56]">Pet Owners</h2>

                <div className="mt-4 space-y-3">
                  {ownersLoading ? (
                    <p className="rounded-xl border border-dashed border-[#d5d7ea] bg-[#f7f8ff] px-4 py-8 text-center text-lg text-[#666e98]">
                      Loading pet owners...
                    </p>
                  ) : ownerFetchError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-lg text-red-700">
                      {ownerFetchError}
                    </p>
                  ) : filteredPetOwners.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-[#d5d7ea] bg-[#f7f8ff] px-4 py-8 text-center text-lg text-[#666e98]">
                      No pet owners found.
                    </p>
                  ) : (
                    filteredPetOwners.map((owner) => {
                      const isSelected = selectedOwner?.id === owner.id;

                      return (
                        <button
                          key={owner.id}
                          onClick={() => handleSelectOwner(owner)}
                          className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-[#bec1ee] bg-[#e9e8fa]"
                              : "border-[#d8d9ea] bg-white hover:bg-[#f7f8ff]"
                          }`}
                        >
                          <h3 className="text-2xl font-semibold text-[#1a1f56]">{owner.name}</h3>
                          <div className="mt-2 space-y-1.5 text-lg text-[#2f356d]">
                            <p className="flex items-center gap-2">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
                              </svg>
                              {owner.email ?? "-"}
                            </p>
                            <p className="flex items-center gap-2">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                              </svg>
                              {owner.telephone ?? "-"}
                            </p>
                            <p className="flex items-center gap-2">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.66 16.66L13.41 20.9a2 2 0 01-2.82 0l-4.25-4.24a8 8 0 1111.32 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {owner.address ?? "-"}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-lg text-[#4e5689]">
                  <p>
                    Showing {Math.min(filteredPetOwners.length, 2)} of {filteredPetOwners.length} owners
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-[#ccd0ec] px-3 py-0.5 text-[#747dae]">
                      &lsaquo;
                    </button>
                    <span className="rounded-lg bg-[#e7e8f9] px-4 py-0.5 text-[#4350dd]">1</span>
                    <button className="rounded-lg border border-[#ccd0ec] px-3 py-0.5 text-[#c1c5e2]">
                      &rsaquo;
                    </button>
                    <button className="ml-1 text-[#3f467d]">Next &rsaquo;</button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-[40px] font-semibold text-[#1a1f56]">Pets</h2>
                <div className="rounded-2xl border border-[#cccee3] bg-white p-4 shadow-sm">
                  {!selectedOwner ? (
                    <p className="text-lg text-[#606793]">Select a pet owner to load pets.</p>
                  ) : petsLoading ? (
                    <p className="text-lg text-[#606793]">Loading pets...</p>
                  ) : petsFetchError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-lg text-red-700">
                      {petsFetchError}
                    </p>
                  ) : ownerPets.length === 0 ? (
                    <p className="text-lg text-[#606793]">No pets found for this owner.</p>
                  ) : (
                    ownerPets.map((pet) => {
                      const isActive = selectedPet?.id === pet.id;

                      return (
                        <button
                          key={pet.id}
                          onClick={() => {
                            setSelectedPetId(pet.id);
                            setPetDetailsError(null);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left ${
                            isActive ? "bg-[#f1f1fd]" : "hover:bg-[#f7f8ff]"
                          }`}
                        >
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            width={74}
                            height={74}
                            className="h-[74px] w-[74px] rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-2xl font-semibold text-[#1a1f56]">{pet.name}</p>
                            <p className="text-xl text-[#2e356d]">{pet.breed}</p>
                            <p className="text-[28px] uppercase tracking-wide text-[#636ad8]">
                              {pet.ageLabel} {pet.gender}
                            </p>
                          </div>
                          <span className="pr-1 text-3xl text-[#2a3169]">&rsaquo;</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#cccee3] bg-white shadow-sm">
              {selectedOwner && selectedPet ? (
                <>
                  <div className="border-b border-[#d8d9eb] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-[46px] font-semibold text-[#161d4f]">{selectedPet.name}</h2>
                        <div className="mt-3 space-y-1.5 text-xl text-[#222a5f]">
                          <p className="flex items-center gap-3">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V4m8 3V4m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 01-2 2h1C9.72 21 3 14.28 3 6V5z" />
                            </svg>
                            <span>{selectedPet.ageLabel}</span>
                            <span>{selectedPet.gender}</span>
                          </p>
                          <p className="flex items-center gap-3">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                            {selectedPet.breed}
                          </p>
                          <p className="flex items-center gap-3">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                            </svg>
                            {selectedPet.weightKg != null ? `${selectedPet.weightKg} kg` : "Weight not available"}
                          </p>
                          <p className="flex items-center gap-3">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.468M15 10a3 3 0 11-6 0 3 3 0 016 0zM12 13a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Registered: <span className="font-semibold">{selectedOwner.name}</span>
                          </p>
                          {selectedPet.notes ? (
                            <p className="text-lg text-[#374080]">Notes: {selectedPet.notes}</p>
                          ) : null}
                        </div>
                      </div>
                      <Image
                        src={selectedPet.image}
                        alt={selectedPet.name}
                        width={240}
                        height={185}
                        className="h-[185px] w-[240px] rounded-2xl object-cover"
                      />
                    </div>

                    {petDetailsLoading ? (
                      <p className="mt-3 text-lg text-[#5f679a]">Refreshing pet details...</p>
                    ) : null}
                    {petDetailsError ? (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-lg text-red-700">
                        {petDetailsError}
                      </p>
                    ) : null}
                    {recordSaveError ? (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-lg text-red-700">
                        {recordSaveError}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#544DFF] to-[#3F47DF] px-4 py-2.5 text-xl font-medium text-white"
                        onClick={() => setShowVaccinationModal(true)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 5.879l4 4m-2-6l2 2a2 2 0 010 2.828l-8.5 8.5L6 18l.793-3.621 8.5-8.5a2 2 0 012.828 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9l3 3" />
                        </svg>
                        Add Vaccination
                      </button>
                      <button className="flex items-center gap-2 rounded-xl border border-[#cacedf] px-4 py-2.5 text-xl text-[#1d2458]"
                        onClick={() => setShowPrescriptionModal(true)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6m-7 4h8m-9 0a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2H8V6a4 4 0 018 0v2" />
                        </svg>
                        Create Prescription
                      </button>
                      <button
                        onClick={() => setShowAddPetModal(true)}
                        className="rounded-xl border border-[#cacedf] p-2.5 text-[#1d2458]"
                        aria-label="Pet settings"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pt-3">
                    <div className="flex items-center gap-8 border-b border-[#d8d9eb] text-[30px]">
                      <button
                        onClick={() => setActiveTab("vaccinations")}
                        className={`pb-2 ${
                          activeTab === "vaccinations"
                            ? "border-b-[3px] border-[#4f57f2] font-semibold text-[#1c2458]"
                            : "text-[#30386f]"
                        }`}
                      >
                        Vaccinations
                      </button>
                      <button
                        onClick={() => setActiveTab("prescriptions")}
                        className={`pb-2 ${
                          activeTab === "prescriptions"
                            ? "border-b-[3px] border-[#4f57f2] font-semibold text-[#1c2458]"
                            : "text-[#30386f]"
                        }`}
                      >
                        Prescriptions
                      </button>
                    </div>

                    {recordsLoading ? (
                      <div className="mt-3 rounded-xl border border-[#d7d9ec] px-5 py-8 text-center text-xl text-[#30386f]">
                        Loading medical records...
                      </div>
                    ) : recordsError ? (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-5 py-6 text-center text-xl text-red-700">
                        {recordsError}
                      </div>
                    ) : activeTab === "vaccinations" ? (
                      vaccinations.length === 0 ? (
                        <div className="mt-3 rounded-xl border border-[#d7d9ec] px-5 py-8 text-center">
                          <h3 className="text-[34px] font-semibold text-[#161d4f]">No vaccinations recorded</h3>
                          <p className="mx-auto mt-2 max-w-[580px] text-xl text-[#30386f]">
                            Add a new vaccination for {selectedPet.name} by clicking the
                            &quot;Add Vaccination&quot; button above.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {vaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="rounded-xl border border-[#d7d9ec] bg-[#f9faff] p-4">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-2xl font-semibold text-[#1c2458]">{vaccination.vaccineName}</p>
                                <p className="text-sm text-[#4d5689]">Given: {formatDateTime(vaccination.givenAt)}</p>
                              </div>
                              <p className="mt-1 text-sm text-[#4d5689]">Valid until: {formatDate(vaccination.validUntil)}</p>
                              <p className="mt-1 text-sm text-[#4d5689]">Recorded by: {vaccination.givenByStaffName}</p>
                              {vaccination.notes ? (
                                <p className="mt-2 text-sm text-[#30386f]">Notes: {vaccination.notes}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )
                    ) : prescriptions.length === 0 ? (
                      <div className="mt-3 rounded-xl border border-[#d7d9ec] px-5 py-8 text-center">
                        <h3 className="text-[34px] font-semibold text-[#161d4f]">No prescriptions recorded</h3>
                        <p className="mx-auto mt-2 max-w-[580px] text-xl text-[#30386f]">
                          Add a prescription for {selectedPet.name} by clicking the
                          &quot;Create Prescription&quot; button above.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {prescriptions.map((prescription) => (
                          <div key={prescription.id} className="rounded-xl border border-[#d7d9ec] bg-[#f9faff] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xl font-semibold text-[#1c2458]">Prescribed: {formatDateTime(prescription.prescribedAt)}</p>
                              <div className="flex items-center gap-3">
                                <p className="text-sm text-[#4d5689]">By: {prescription.prescribedByStaffName}</p>
                                <button
                                  type="button"
                                  onClick={() => handlePrintPrescription(prescription)}
                                  className="rounded-lg border border-[#cdd1ea] px-3 py-1 text-sm font-medium text-[#2e356d] hover:bg-[#f5f6ff]"
                                >
                                  Print Prescription
                                </button>
                              </div>
                             </div>
                            {prescription.diagnosis ? (
                              <p className="mt-2 text-sm text-[#30386f]">Diagnosis: {prescription.diagnosis}</p>
                            ) : null}
                            {prescription.notes ? (
                              <p className="mt-1 text-sm text-[#30386f]">Notes: {prescription.notes}</p>
                            ) : null}
                            <div className="mt-3 space-y-2">
                              {prescription.items.map((item) => (
                                <div key={item.id} className="rounded-lg border border-[#d9dbef] bg-white px-3 py-2">
                                  <p className="text-sm font-semibold text-[#1e275f]">{item.medicineName}</p>
                                  <p className="text-sm text-[#4d5689]">
                                    {item.dosage} | {item.frequency} | {item.durationDays} day(s) | Qty: {item.quantity}
                                  </p>
                                  {item.instructions ? (
                                    <p className="text-sm text-[#4d5689]">Instructions: {item.instructions}</p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between py-3 text-xl text-[#4d5689]">
                      <button>&lsaquo; Previous</button>
                      <p>Showing {activeTab === "vaccinations" ? vaccinations.length : prescriptions.length} record(s)</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-xl text-[#4f5789]">
                  {selectedOwner
                    ? "Select a pet from the list to view details."
                    : "Select a pet owner to view details."}
                </div>
              )}
            </section>
          </div>
        </main>

        {showAddOwnerModal && (
          <AddPetOwnerModal
            onClose={() => setShowAddOwnerModal(false)}
            onAdd={handleAddPetOwner}
          />
        )}

        {showAddPetModal && selectedOwner && (
          <AddPetModal
            ownerName={selectedOwner.name}
            onClose={() => setShowAddPetModal(false)}
            onAdd={handleAddPet}
          />
        )}

        {showVaccinationModal && selectedPet && (
          <AddVaccinationModal
            petName={selectedPet.name}
            onClose={() => setShowVaccinationModal(false)}
            onSubmit={handleCreateVaccination}
          />
        )}

        {showPrescriptionModal && selectedPet && (
          <CreatePrescriptionModal
            petId={selectedPet.id}
            petName={selectedPet.name}
            onClose={() => setShowPrescriptionModal(false)}
            onSubmit={handleCreatePrescription}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
