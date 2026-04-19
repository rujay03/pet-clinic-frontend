// components/pharmacy-staff/medicine/AddMedicineForm.tsx
"use client";

import { useEffect, useState } from "react";
import type { CreateMedicineRequest, Medicine } from "@/types/pharmacy";

interface AddMedicineFormProps {
  onSubmit: (payload: CreateMedicineRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  initialValues?: Medicine | null;
  title?: string;
  submitLabel?: string;
}

export default function AddMedicineForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
  initialValues,
  title = "Add Medicine",
  submitLabel = "Save Medicine",
}: AddMedicineFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [genericName, setGenericName] = useState(initialValues?.genericName ?? "");
  const [medicineForm, setMedicineForm] = useState(initialValues?.form ?? "");
  const [strength, setStrength] = useState(initialValues?.strength ?? "");
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setGenericName(initialValues?.genericName ?? "");
    setMedicineForm(initialValues?.form ?? "");
    setStrength(initialValues?.strength ?? "");
    setIsActive(initialValues?.isActive ?? true);
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      genericName: genericName.trim(),
      form: medicineForm.trim(),
      strength: strength.trim(),
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-[#18214f]">{title}</h2>
        <p className="mt-1 text-sm text-[#55628e]">
          Save a new medicine record to the database.
        </p>
      </div>

      <div>
        <label
          htmlFor="medicine-name"
          className="mb-1.5 block text-sm font-medium text-[#2b3c72]"
        >
          Medicine Name
        </label>
        <input
          id="medicine-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={150}
          className="h-11 w-full rounded-xl border border-[#d8dfee] px-4 text-[#1f2a58] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="medicine-generic-name"
            className="mb-1.5 block text-sm font-medium text-[#2b3c72]"
          >
            Generic Name
          </label>
          <input
            id="medicine-generic-name"
            type="text"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
            maxLength={150}
            className="h-11 w-full rounded-xl border border-[#d8dfee] px-4 text-[#1f2a58] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            htmlFor="medicine-form"
            className="mb-1.5 block text-sm font-medium text-[#2b3c72]"
          >
            Form
          </label>
          <input
            id="medicine-form"
            type="text"
            value={medicineForm}
            onChange={(e) => setMedicineForm(e.target.value)}
            maxLength={60}
            className="h-11 w-full rounded-xl border border-[#d8dfee] px-4 text-[#1f2a58] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
            placeholder="Tablet / Syrup"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="medicine-strength"
          className="mb-1.5 block text-sm font-medium text-[#2b3c72]"
        >
          Strength
        </label>
        <input
          id="medicine-strength"
          type="text"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
          maxLength={60}
          className="h-11 w-full rounded-xl border border-[#d8dfee] px-4 text-[#1f2a58] focus:outline-none focus:ring-2 focus:ring-[#7f8ec5]"
          placeholder="e.g. 250 mg"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-[#2b3c72]">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-[#c0cbe2] text-[#1f5fe0] focus:ring-[#7f8ec5]"
        />
        Active medicine
      </label>

      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#d8dfee] px-4 py-2 text-sm font-medium text-[#2b3c72] hover:bg-[#f7f8fc]"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[#1f5fe0] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a54c9] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
