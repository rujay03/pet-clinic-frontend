"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

interface MedicineOption {
  id: number;
  name: string;
}

interface PrescriptionItemPayload {
  medicineId: number;
  dosage: string;
  frequency: string;
  durationDays: number;
  quantity: number;
  instructions: string;
}

interface PrescriptionItemForm extends Omit<PrescriptionItemPayload, "medicineId"> {
  uid: string;
  medicineQuery: string;
  selectedMedicineId: number | null;
}

interface CreatePrescriptionModalProps {
  petId: number;
  petName: string;
  onClose: () => void;
  onSubmit: (payload: {
    prescribedAt: string;
    diagnosis: string;
    notes: string;
    items: PrescriptionItemPayload[];
  }) => Promise<void> | void;
}

const createEmptyItem = (): PrescriptionItemForm => ({
  uid: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  medicineQuery: "",
  selectedMedicineId: null,
  dosage: "",
  frequency: "",
  durationDays: 1,
  quantity: 1,
  instructions: "",
});

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
  });
  const [items, setItems] = useState<PrescriptionItemForm[]>([createEmptyItem()]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [medicineOptionsByItem, setMedicineOptionsByItem] = useState<Record<string, MedicineOption[]>>({});
  const [medicineLoadingByItem, setMedicineLoadingByItem] = useState<Record<string, boolean>>({});

  const canRemoveItem = useMemo(() => items.length > 1, [items.length]);

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItem = (uid: string) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid));
    setMedicineOptionsByItem((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
    setMedicineLoadingByItem((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
  };

  const updateItem = (uid: string, updater: (prev: PrescriptionItemForm) => PrescriptionItemForm) => {
    setItems((prev) => prev.map((item) => (item.uid === uid ? updater(item) : item)));
  };

  const searchMedicines = async (uid: string, query: string) => {
    setMedicineLoadingByItem((prev) => ({ ...prev, [uid]: true }));

    try {
      const list = await apiFetch<MedicineOption[]>(
        `/api/pets/${petId}/medicine-search?query=${encodeURIComponent(query)}`
      );
      setMedicineOptionsByItem((prev) => ({ ...prev, [uid]: list }));
    } catch {
      setMedicineOptionsByItem((prev) => ({ ...prev, [uid]: [] }));
    } finally {
      setMedicineLoadingByItem((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleMedicineInputChange = async (uid: string, value: string) => {
    updateItem(uid, (prev) => ({ ...prev, medicineQuery: value, selectedMedicineId: null }));
    await searchMedicines(uid, value);
  };

  const handleSelectMedicine = (uid: string, option: MedicineOption) => {
    updateItem(uid, (prev) => ({ ...prev, medicineQuery: option.name, selectedMedicineId: option.id }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.prescribedAt) {
      setError("Prescribed date/time is required");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one medicine item");
      return;
    }

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const row = index + 1;

      if (!item.selectedMedicineId) {
        setError(`Row ${row}: please search and select a medicine`);
        return;
      }

      if (!item.dosage.trim()) {
        setError(`Row ${row}: dosage is required`);
        return;
      }

      if (!item.frequency.trim()) {
        setError(`Row ${row}: frequency is required`);
        return;
      }

      if (item.durationDays < 1) {
        setError(`Row ${row}: duration must be at least 1 day`);
        return;
      }

      if (item.quantity < 1) {
        setError(`Row ${row}: quantity must be at least 1`);
        return;
      }
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        items: items.map((item) => ({
          medicineId: item.selectedMedicineId!,
          dosage: item.dosage,
          frequency: item.frequency,
          durationDays: item.durationDays,
          quantity: item.quantity,
          instructions: item.instructions,
        })),
      });
    } catch {
      setError("Failed to save prescription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
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

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 space-y-4 overflow-y-auto px-6 py-5">
          {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#2e356d]">Medicines</p>
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-[#cdd1ea] px-3 py-1.5 text-sm font-medium text-[#2e356d] hover:bg-[#f5f6ff]"
              >
                + Add medicine
              </button>
            </div>

            {items.map((item, index) => {
              const options = medicineOptionsByItem[item.uid] ?? [];
              const isLoading = medicineLoadingByItem[item.uid] ?? false;

              return (
                <div key={item.uid} className="rounded-xl border border-[#d9dbef] bg-[#fafbff] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#2e356d]">Medicine #{index + 1}</p>
                    <button
                      type="button"
                      disabled={!canRemoveItem}
                      onClick={() => removeItem(item.uid)}
                      className="rounded-lg border border-[#d9dbef] px-2 py-1 text-xs text-[#51588c] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#2e356d]">Medicine Name</label>
                    <input
                      type="text"
                      value={item.medicineQuery}
                      onChange={(event) => {
                        void handleMedicineInputChange(item.uid, event.target.value);
                      }}
                      className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                      placeholder="Search medicine"
                    />
                    <div className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-[#e0e3f2] bg-white">
                      {isLoading ? (
                        <p className="px-3 py-2 text-sm text-[#5a628f]">Searching...</p>
                      ) : options.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-[#5a628f]">No medicines found</p>
                      ) : (
                        options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelectMedicine(item.uid, option)}
                            className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#f1f3ff] ${
                              item.selectedMedicineId === option.id
                                ? "bg-[#eef0ff] text-[#1f275f]"
                                : "text-[#30386f]"
                            }`}
                          >
                            {option.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#2e356d]">Dosage</label>
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(event) =>
                          updateItem(item.uid, (prev) => ({ ...prev, dosage: event.target.value }))
                        }
                        className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                        placeholder="e.g. 1 tablet"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#2e356d]">Frequency</label>
                      <input
                        type="text"
                        value={item.frequency}
                        onChange={(event) =>
                          updateItem(item.uid, (prev) => ({ ...prev, frequency: event.target.value }))
                        }
                        className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                        placeholder="e.g. Twice daily"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#2e356d]">Duration (days)</label>
                      <input
                        type="number"
                        min={1}
                        value={item.durationDays}
                        onChange={(event) =>
                          updateItem(item.uid, (prev) => ({
                            ...prev,
                            durationDays: Number(event.target.value) || 1,
                          }))
                        }
                        className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#2e356d]">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.uid, (prev) => ({
                            ...prev,
                            quantity: Number(event.target.value) || 1,
                          }))
                        }
                        className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-sm font-medium text-[#2e356d]">Item Instructions</label>
                    <textarea
                      rows={2}
                      value={item.instructions}
                      onChange={(event) =>
                        updateItem(item.uid, (prev) => ({ ...prev, instructions: event.target.value }))
                      }
                      className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
                      placeholder="Optional medicine instructions"
                    />
                  </div>
                </div>
              );
            })}
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
