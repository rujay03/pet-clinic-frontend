// components/doctor/AddPetModal.tsx
"use client";

import { useState, FormEvent } from "react";

interface AddPetModalProps {
  ownerName: string;
  onClose: () => void;
  onAdd: (pet: {
    name: string;
    species: string;
    breed: string;
    gender: string;
    dateOfBirth: string;
  }) => Promise<void>;
}

export default function AddPetModal({
  ownerName,
  onClose,
  onAdd,
}: AddPetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    breed: "",
    gender: "Male",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Pet name is required");
      return;
    }
    if (!formData.breed.trim()) {
      setError("Breed is required");
      return;
    }
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    const selectedDate = new Date(formData.dateOfBirth);
    const today = new Date();
    if (selectedDate > today) {
      setError("Date of birth cannot be in the future");
      return;
    }

    setLoading(true);

    try {
      await onAdd(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add pet";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Pet</h2>
            <p className="text-sm text-gray-500 mt-1">
              Register pet for {ownerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Pet Name Field */}
          <div>
            <label
              htmlFor="petName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pet Name<span className="text-red-500">*</span>
            </label>
            <input
              id="petName"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter pet name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Species Dropdown */}
          <div>
            <label
              htmlFor="species"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Species<span className="text-red-500">*</span>
            </label>
            <select
              id="species"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.species}
              onChange={(e) =>
                setFormData({ ...formData, species: e.target.value })
              }
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Hamster">Hamster</option>
              <option value="Guinea Pig">Guinea Pig</option>
              <option value="Fish">Fish</option>
              <option value="Reptile">Reptile</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Breed Field */}
          <div>
            <label
              htmlFor="breed"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Breed<span className="text-red-500">*</span>
            </label>
            <input
              id="breed"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter breed"
              value={formData.breed}
              onChange={(e) =>
                setFormData({ ...formData, breed: e.target.value })
              }
            />
          </div>

          {/* Gender Dropdown */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender<span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Pet Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
