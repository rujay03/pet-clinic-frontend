"use client";

import { FormEvent, useState } from "react";

interface AddVaccinationModalProps {
  petName: string;
  onClose: () => void;
  onSubmit: (payload: {
    vaccineName: string;
    givenAt: string;
    validUntil: string;
    notes: string;
  }) => Promise<void> | void;
}

export default function AddVaccinationModal({
  petName,
  onClose,
  onSubmit,
}: AddVaccinationModalProps) {
  const [formData, setFormData] = useState({
    vaccineName: "",
    givenAt: "",
    validUntil: "",
    notes: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.vaccineName.trim()) {
      setError("Vaccine name is required");
      return;
    }

    if (!formData.givenAt) {
      setError("Given date and time is required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch {
      setError("Failed to save vaccination. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1c255e]">Add Vaccination</h2>
            <p className="text-sm text-[#5a628f]">Record a vaccination for {petName}</p>
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
            <label htmlFor="vaccineName" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Vaccine Name
            </label>
            <input
              id="vaccineName"
              type="text"
              value={formData.vaccineName}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, vaccineName: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="e.g. Rabies"
            />
          </div>

          <div>
            <label htmlFor="vaccinationGivenAt" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Given At
            </label>
            <input
              id="vaccinationGivenAt"
              type="datetime-local"
              value={formData.givenAt}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, givenAt: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
            />
          </div>

          <div>
            <label htmlFor="vaccinationValidUntil" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Valid Until
            </label>
            <input
              id="vaccinationValidUntil"
              type="date"
              value={formData.validUntil}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, validUntil: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
            />
          </div>

          <div>
            <label htmlFor="vaccinationNotes" className="mb-1 block text-sm font-medium text-[#2e356d]">
              Notes
            </label>
            <textarea
              id="vaccinationNotes"
              rows={3}
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, notes: event.target.value }))
              }
              className="w-full rounded-lg border border-[#cdd1ea] px-3 py-2 text-sm text-[#1f275f] focus:outline-none focus:ring-2 focus:ring-[#4f57f2]"
              placeholder="Optional notes"
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
              {submitting ? "Saving..." : "Save Vaccination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
