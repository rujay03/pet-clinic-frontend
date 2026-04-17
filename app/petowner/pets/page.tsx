"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Pet } from "@/types/pet";
import PetCard from "@/components/petowner/pets/PetCard";
import AddPetModal from "@/components/petowner/pets/AddPetModal";
import EditPetModal from "@/components/petowner/pets/EditPetModal";

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Pet[]>("/api/pets");
      setPets(data);
    } catch (error) {
      console.error("Failed to load pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePetAdded = () => {
    setShowAddModal(false);
    loadPets();
  };

  const handlePetUpdated = () => {
    setEditingPet(null);
    loadPets();
  };

  const handleDeletePet = async (petId: number) => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    try {
      await apiFetch(`/api/pets/${petId}`, { method: "DELETE" });
      loadPets();
    } catch (error) {
      console.error("Failed to delete pet:", error);
      alert("Failed to delete pet. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
          <p className="mt-1 text-gray-600">
            Manage your beloved pets and their information
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
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
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Pet
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && pets.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No Pets Yet
          </h3>
          <p className="mb-6 text-gray-600">
            Start by adding your first pet to manage their health records
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add Your First Pet
          </button>
        </div>
      )}

      {/* Pets Grid */}
      {!loading && pets.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={() => setEditingPet(pet)}
              onDelete={() => handleDeletePet(pet.id)}
            />
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <AddPetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handlePetAdded}
        />
      )}

      {/* Edit Pet Modal */}
      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onSuccess={handlePetUpdated}
        />
      )}
    </div>
  );
}

