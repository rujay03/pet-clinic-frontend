// components/pharmacy-staff/medicine/AddMedicineForm.tsx
"use client";

import { useState } from "react";

export default function AddMedicineForm() {
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineId: "",
    medicineGroup: "",
    quantity: "",
    howToUse: "",
    sideEffects: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: API call to save medicine details
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-slate-500 mb-1">
          <span className="text-slate-700 font-medium">Inventory</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700 font-medium">List of Medicines</span>
          <span className="mx-2">›</span>
          <span className="text-slate-900 font-semibold">
            Add New Inventory
          </span>
        </div>
        <p className="text-xs text-slate-600">
          *All fields are mandatory, except mentioned as (optional).
        </p>
      </div>

      {/* Filter Icon */}
      <div className="flex justify-end mb-4">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* First Row: Medicine Name and Medicine ID */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="medicineName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Medicine Name
            </label>
            <input
              type="text"
              id="medicineName"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="medicineId"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Medicine ID
            </label>
            <input
              type="text"
              id="medicineId"
              name="medicineId"
              value={formData.medicineId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              required
            />
          </div>
        </div>

        {/* Second Row: Medicine Group and Quantity */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="medicineGroup"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Medicine Group
            </label>
            <select
              id="medicineGroup"
              name="medicineGroup"
              value={formData.medicineGroup}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
              required
            >
              <option value="">- Select Group -</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Antiparasitics">Antiparasitics</option>
              <option value="Pain Management">Pain Management</option>
              <option value="Vaccines">Vaccines</option>
              <option value="Supplements">Supplements</option>
              <option value="Cardiac">Cardiac</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Quantity in Number
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              required
            />
          </div>
        </div>

        {/* How to Use */}
        <div className="mb-4">
          <label
            htmlFor="howToUse"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            How to Use
          </label>
          <textarea
            id="howToUse"
            name="howToUse"
            value={formData.howToUse}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 resize-none"
            required
          />
        </div>

        {/* Side Effects */}
        <div className="mb-6">
          <label
            htmlFor="sideEffects"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Side Effects
          </label>
          <textarea
            id="sideEffects"
            name="sideEffects"
            value={formData.sideEffects}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 resize-none"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Save Details
        </button>
      </form>
    </div>
  );
}
