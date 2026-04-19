"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface MedicineOption {
  id: number;
  name: string;
}

interface CreatePrescriptionModalProps {
  petId: number;
  petName: string;
  onClose: () => void;
  onSubmit: (payload: {
    prescribedAt: string;
    diagnosis: string;
    notes: string;
    medicineId: number;
    dosage: string;
    frequency: string;
    durationDays: number;
    quantity: number;
    instructions: string;
  }) => Promise<void> | void;
}

export default function CreatePrescriptionModal({
  petId,
  petName,
  onClose,
  onSubmit,
}: CreatePrescriptionModalProps) {
  const [formData, setFormData] = useState({
    prescribedAt: "",
    diagnosis: "",
    notes: "",
    medicineId: 0,
    dosage: "",
    frequency: "",
    durationDays: 1,
    quantity: 1,
    instructions: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineOptions, setMedicineOptions] = useState<MedicineOption[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [medicineLoading, setMedicineLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadMedicines = async () => {
      setMedicineLoading(true);
      try {
        const list = await apiFetch<MedicineOption[]>(
          `/api/pets/${petId}/medicine-search?query=${encodeURIComponent(medicineQuery)}`
        );
        if (active) {
          setMedicineOptions(list);
        }
      } catch {
        if (active) {
          setMedicineOptions([]);
        }
      } finally {
        if (active) {
          setMedicineLoading(false);
        }
      }
    };

    loadMedicines();

    return () => {
      active = false;
    };
  }, [medicineQuery, petId]);

  const handleSelectMedicine = (option: MedicineOption) => {
    setMedicineQuery(option.name);
    setSelectedMedicineId(option.id);
  };

  const handleMedicineInputChange = (value: string) => {
    setMedicineQuery(value);
    setSelectedMedicineId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.prescribedAt) {
      setError("Prescribed date/time is required");
      return;
    }

    if (!selectedMedicineId) {
      setError("Please search and select a medicine");
      return;
    }

    if (!formData.dosage.trim()) {
      setError("Dosage is required");
      return;
    }

    if (!formData.frequency.trim()) {
      setError("Frequency is required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        medicineId: selectedMedicineId,
      });
    } catch {
      setError("Failed to save prescription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1c255e]">Create Prescription</h2>
            <p className="text-sm text-[#5a628f]">Create prescription for {petName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div>
            <label htmlFor="prescribedAt" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Prescribed At
            </label>
            <input
              id="prescribedAt"
              type="datetime-local"
              value={formData.prescribedAt}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, prescribedAt: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
            />
          </div>

          <div>
            <label htmlFor="diagnosis" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              rows={2}
              value={formData.diagnosis}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, diagnosis: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="Optional diagnosis"
            />
          </div>

          <div>
            <label htmlFor="medicineSearch" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Medicine Name
            </label>
            <input
              id="medicineSearch"
              type="text"
              value={medicineQuery}
              onChange={(event) => handleMedicineInputChange(event.target.value)}
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="Search medicine"
            />
            <div className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-[#e0e3f2] bg-white">
              {medicineLoading ? (
                <p className="px-3 py-2 text-sm text-[#5a628f]">Searching...</p>
              ) : medicineOptions.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[#5a628f]">No medicines found</p>
              ) : (
                medicineOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectMedicine(option)}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#f1f3ff] ${
                      selectedMedicineId === option.id ? "bg-[#eef0ff] text-[#1f275f]" : "text-[#30386f]"
                    }`}
                  >
                    {option.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dosage" className="mb-1 block text-sm font-medium text-[#2e356d]">
                Dosage
              </label>
              <input
                id="dosage"
                type="text"
                value={formData.dosage}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, dosage: event.target.value }))
                }
                className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                placeholder="e.g. 1 tablet"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="mb-1 block text-sm font-medium text-[#2e356d]">
                Frequency
              </label>
              <input
                id="frequency"
                type="text"
                value={formData.frequency}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, frequency: event.target.value }))
                }
                className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                placeholder="e.g. Twice daily"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="durationDays" className="mb-1 block text-sm font-medium text-[#2e356d]">
                Duration (days)
              </label>
              <input
                id="durationDays"
                type="number"
                min={1}
                value={formData.durationDays}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, durationDays: Number(event.target.value) || 1 }))
                }
                className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-[#2e356d]">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, quantity: Number(event.target.value) || 1 }))
                }
                className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="itemInstructions" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Item Instructions
            </label>
            <textarea
              id="itemInstructions"
              rows={2}
              value={formData.instructions}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, instructions: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="Optional medicine instructions"
            />
          </div>

          <div>
            <label htmlFor="prescriptionNotes" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Prescription Notes
            </label>
            <textarea
              id="prescriptionNotes"
              rows={2}
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, notes: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="Optional overall notes"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-[#cdd1ea] px-4 py-2 text-sm font-medium text-[#2e356d] hover:bg-[#f5f6ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#4f57f2] px-4 py-2 text-sm font-medium text-white hover:bg-[#434be1] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
