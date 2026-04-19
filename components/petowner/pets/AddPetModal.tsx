"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import Image from "next/image";
import { ApiError, apiFetch, apiFetchMultipart } from "@/lib/api";
import type { Pet } from "@/types/pet";

interface AddPetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPetModal({ onClose, onSuccess }: AddPetModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [speciesError, setSpeciesError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "MALE" as "MALE" | "FEMALE" | "UNKNOWN",
    dateOfBirth: "",
    notes: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadSpecies = async () => {
      try {
        setSpeciesLoading(true);
        setSpeciesError(null);
        const response = await apiFetch<string[]>("/api/pets/species");
        if (!isMounted) return;
        setSpeciesOptions(
          response
            .map((name) => name?.trim())
            .filter((name): name is string => Boolean(name)),
        );
      } catch (err: unknown) {
        if (!isMounted) return;
        const message = err instanceof ApiError ? err.message : "Failed to load pet species.";
        setSpeciesError(message);
      } finally {
        if (isMounted) setSpeciesLoading(false);
      }
    };

    void loadSpecies();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("species", formData.species);
      if (formData.breed) fd.append("breed", formData.breed);
      fd.append("sex", formData.sex);
      if (formData.dateOfBirth) fd.append("dateOfBirth", formData.dateOfBirth);
      if (formData.notes) fd.append("notes", formData.notes);
      if (imageFile) fd.append("image", imageFile);

      await apiFetchMultipart<Pet>("/api/pets", "POST", fd);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Add New Pet</h2>
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

          {/* Pet Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Photo
            </label>
            <div className="flex items-center gap-4">
              {/* Preview / Placeholder */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Pet preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-blue-400">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "🐾"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {imagePreview ? "Change Photo" : "Upload Photo"}
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Remove Photo
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  JPG, JPEG or PNG · Max 5 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={speciesLoading || speciesOptions.length === 0}
            >
              <option value="" className="text-black">
                {speciesLoading ? "Loading species..." : "Select species"}
              </option>
              {speciesOptions.map((speciesName) => (
                <option key={speciesName} value={speciesName}>
                  {speciesName}
                </option>
              ))}
            </select>
            {speciesError && (
              <p className="mt-2 text-xs text-red-600">{speciesError}</p>
            )}
            {!speciesLoading && !speciesError && speciesOptions.length === 0 && (
              <p className="mt-2 text-xs text-amber-700">
                No species available in catalog.
              </p>
            )}
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
              {(["MALE", "FEMALE"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value={s}
                    checked={formData.sex === s}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sex: e.target.value as "MALE" | "FEMALE" | "UNKNOWN",
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </span>
                </label>
              ))}
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
              {loading ? "Adding..." : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
