"use client";

import type { Pet } from "@/types/pet";

interface PetCardProps {
  pet: Pet;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const getPetIcon = (species: string) => {
    const speciesLower = species.toLowerCase();
    if (speciesLower.includes("dog")) {
      return "🐕";
    } else if (speciesLower.includes("cat")) {
      return "🐈";
    } else if (speciesLower.includes("bird")) {
      return "🐦";
    } else if (speciesLower.includes("rabbit")) {
      return "🐰";
    } else if (speciesLower.includes("fish")) {
      return "🐠";
    } else if (speciesLower.includes("hamster") || speciesLower.includes("guinea")) {
      return "🐹";
    } else {
      return "🐾";
    }
  };

  const getSexColor = (sex: string) => {
    switch (sex) {
      case "MALE":
        return "bg-blue-100 text-blue-800";
      case "FEMALE":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSexLabel = (sex: string) => {
    switch (sex) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl">
            {getPetIcon(pet.species)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
            <p className="text-sm text-gray-500">{pet.species}</p>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative group">
          <button className="text-gray-400 hover:text-gray-600 p-1">
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button
              onClick={onEdit}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={onDelete}
              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {pet.breed && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Breed:</span>
            <span className="text-gray-900 font-medium">{pet.breed}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Sex:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSexColor(
              pet.sex
            )}`}
          >
            {getSexLabel(pet.sex)}
          </span>
        </div>

        {pet.age !== undefined && pet.age !== null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Age:</span>
            <span className="text-gray-900 font-medium">
              {pet.age} {pet.age === 1 ? "year" : "years"} old
            </span>
          </div>
        )}

        {pet.dateOfBirth && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Born:</span>
            <span className="text-gray-900 font-medium">
              {new Date(pet.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {pet.notes && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{pet.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Added {new Date(pet.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

