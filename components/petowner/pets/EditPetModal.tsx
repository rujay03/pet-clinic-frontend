"use client";

import { useState, FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import type { Pet, UpdatePetRequest } from "@/types/pet";

interface EditPetModalProps {
  pet: Pet;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPetModal({
  pet,
  onClose,
  onSuccess,
}: EditPetModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdatePetRequest>({
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    sex: pet.sex,
    dateOfBirth: pet.dateOfBirth || "",
    notes: pet.notes || "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: UpdatePetRequest = {
        ...formData,
        breed: formData.breed || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        notes: formData.notes || undefined,
      };

      await apiFetch(`/api/pets/${pet.id}`, {
        method: "PUT",
        body: payload,
      });

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Edit Pet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              placeholder="e.g., Max, Bella, Whiskers"
              required
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.species}
              onChange={(e) =>
                setFormData({ ...formData, species: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="" className="text-black">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Hamster">Hamster</option>
              <option value="Guinea Pig">Guinea Pig</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breed
            </label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) =>
                setFormData({ ...formData, breed: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              placeholder="e.g., Golden Retriever, Persian"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sex <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="MALE"
                  checked={formData.sex === "MALE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sex: e.target.value as "MALE" | "FEMALE" | "UNKNOWN",
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="FEMALE"
                  checked={formData.sex === "FEMALE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sex: e.target.value as "MALE" | "FEMALE" | "UNKNOWN",
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="text-sm text-gray-700">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="UNKNOWN"
                  checked={formData.sex === "UNKNOWN"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sex: e.target.value as "MALE" | "FEMALE" | "UNKNOWN",
                    })
                  }
                  className="w-4 h-4 text-gray-600"
                />
                <span className="text-sm text-gray-700">Unknown</span>
              </label>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black placeholder:text-black"
              placeholder="Any special information about your pet..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

