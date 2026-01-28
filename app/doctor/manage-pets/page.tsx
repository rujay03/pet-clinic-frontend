// app/doctor/manage-pets/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DoctorShell from "@/components/doctor/DoctorShell";
import AddPetOwnerModal from "@/components/doctor/AddPetOwnerModal";
import AddPetModal from "@/components/doctor/AddPetModal";

interface PetOwner {
  id: number;
  name: string;
  email: string;
  address: string;
  telephone: string;
}

interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
}

// Mock data for demonstration
const initialPetOwners: PetOwner[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St, Colombo",
    telephone: "0771234567",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    address: "456 Park Ave, Kandy",
    telephone: "0779876543",
  },
];

const initialPets: Pet[] = [
  {
    id: 1,
    ownerId: 1,
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Male",
    dateOfBirth: "2020-05-15",
  },
  {
    id: 2,
    ownerId: 1,
    name: "Bella",
    species: "Cat",
    breed: "Persian",
    gender: "Female",
    dateOfBirth: "2021-08-22",
  },
];

export default function ManagePetsPage() {
  const { user } = useAuth();
  const [petOwners, setPetOwners] = useState<PetOwner[]>(initialPetOwners);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<PetOwner | null>(null);

  if (!user) {
    return null;
  }

  // Filter pet owners based on search query
  const filteredPetOwners = petOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.telephone.includes(searchQuery)
  );

  // Get pets for selected owner
  const ownerPets = selectedOwner
    ? pets.filter((pet) => pet.ownerId === selectedOwner.id)
    : [];

  const handleAddPetOwner = (newOwner: Omit<PetOwner, "id">) => {
    const owner: PetOwner = {
      ...newOwner,
      id: petOwners.length + 1,
    };
    setPetOwners([...petOwners, owner]);
    setShowAddOwnerModal(false);
  };

  const handleAddPet = (newPet: Omit<Pet, "id" | "ownerId">) => {
    if (!selectedOwner) return;

    const pet: Pet = {
      ...newPet,
      id: pets.length + 1,
      ownerId: selectedOwner.id,
    };
    setPets([...pets, pet]);
    setShowAddPetModal(false);
  };

  const handleSelectOwner = (owner: PetOwner) => {
    setSelectedOwner(owner);
  };

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <DoctorShell userEmail={user.email}>
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Manage Pets
            </h1>
            <p className="text-slate-600">
              Manage pet owners and their pets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Pet Owners List */}
            <div className="space-y-6">
              {/* Search and Add Button */}
              <div className="flex items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search pet owners..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Add Pet Owner Button */}
                <button
                  onClick={() => setShowAddOwnerModal(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5"
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
                  Add Pet Owner
                </button>
              </div>

              {/* Pet Owners List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Pet Owners
                  </h2>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredPetOwners.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No pet owners found
                      </p>
                    ) : (
                      filteredPetOwners.map((owner) => (
                        <div
                          key={owner.id}
                          onClick={() => handleSelectOwner(owner)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedOwner?.id === owner.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 mb-1">
                                {owner.name}
                              </h3>
                              <div className="space-y-1 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
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
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {owner.email}
                                </p>
                                <p className="flex items-center gap-2">
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
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                  {owner.telephone}
                                </p>
                                <p className="flex items-start gap-2">
                                  <svg
                                    className="w-4 h-4 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {owner.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pet Details */}
            <div className="space-y-6">
              {selectedOwner ? (
                <>
                  {/* Selected Owner Info */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selectedOwner.name}&apos;s Pets
                      </h2>
                      <button
                        onClick={() => setShowAddPetModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add New Pet
                      </button>
                    </div>

                    {/* Pets List */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {ownerPets.length === 0 ? (
                        <div className="text-center py-12">
                          <svg
                            className="w-16 h-16 mx-auto text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <p className="text-gray-500 text-sm">
                            No pets added yet
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Click &quot;Add New Pet&quot; to register a pet
                          </p>
                        </div>
                      ) : (
                        ownerPets.map((pet) => (
                          <div
                            key={pet.id}
                            className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                  {pet.name[0]}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-lg">
                                    {pet.name}
                                  </h3>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
                                    <div>
                                      <span className="font-medium">
                                        Species:
                                      </span>{" "}
                                      {pet.species}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Breed:
                                      </span>{" "}
                                      {pet.breed}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Gender:
                                      </span>{" "}
                                      {pet.gender}
                                    </div>
                                    <div>
                                      <span className="font-medium">DOB:</span>{" "}
                                      {new Date(
                                        pet.dateOfBirth
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <svg
                    className="w-20 h-20 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Select a Pet Owner
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Choose a pet owner from the list to view and manage their
                    pets
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Pet Owner Modal */}
        {showAddOwnerModal && (
          <AddPetOwnerModal
            onClose={() => setShowAddOwnerModal(false)}
            onAdd={handleAddPetOwner}
          />
        )}

        {/* Add Pet Modal */}
        {showAddPetModal && selectedOwner && (
          <AddPetModal
            ownerName={selectedOwner.name}
            onClose={() => setShowAddPetModal(false)}
            onAdd={handleAddPet}
          />
        )}
      </DoctorShell>
    </ProtectedRoute>
  );
}

