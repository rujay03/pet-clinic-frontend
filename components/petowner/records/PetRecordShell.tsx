"use client";

import { useState } from "react";

interface MedicalHistoryRecord {
  date: string;
  visitReason: string;
  diagnosis: string;
  treatment: string;
}

interface FileRecord {
  fileName: string;
  type: string;
  date: string;
  action: "View" | "Download";
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
}

export default function PetRecordShell() {
  const pets: Pet[] = [
    {
      id: "buddy",
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: "5 years",
    },
    {
      id: "roxy",
      name: "Roxy",
      species: "Dog",
      breed: "Golden Retriever",
      age: "2 years",
    },
    {
      id: "lucy",
      name: "Lucy",
      species: "Cat",
      breed: "Persian",
      age: "3 years",
    },
  ];

  const [selectedPetId, setSelectedPetId] = useState(pets[0].id);
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || pets[0];

  const [medicalHistory] = useState<MedicalHistoryRecord[]>([
    {
      date: "2023-01-15",
      visitReason: "Annual Checkup",
      diagnosis: "Healthy",
      treatment: "Vaccinations",
    },
    {
      date: "2023-05-20",
      visitReason: "Skin Condition",
      diagnosis: "Allergic Reaction",
      treatment: "Medication",
    },
    {
      date: "2023-09-10",
      visitReason: "Limping",
      diagnosis: "Minor Sprain",
      treatment: "Rest and Pain Relief",
    },
  ]);

  const [files] = useState<FileRecord[]>([
    {
      fileName: "X-Ray - Leg",
      type: "Image",
      date: "2023-09-10",
      action: "View",
    },
    {
      fileName: "Prescription - Pain Relief",
      type: "PDF",
      date: "2023-09-10",
      action: "Download",
    },
  ]);

  const handleAction = (fileName: string, action: string) => {
    console.log(`${action} ${fileName}`);
    // Implement view/download logic here
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* Page Header with Pet Selector */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Record</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and update patient medical information
          </p>
        </div>

        {/* Pet Selector Dropdown */}
        <div className="relative">
          <label className="mb-2 block text-xs font-medium text-gray-500">
            Select Pet
          </label>
          <div className="relative">
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-48 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Patient Information
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="text-xs font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Species</p>
              <p className="mt-1 text-sm text-gray-900">
                {selectedPet.species}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Breed</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.breed}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Age</p>
              <p className="mt-1 text-sm text-gray-900">{selectedPet.age}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medical History */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Medical History
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Visit Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Treatment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicalHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.visitReason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.diagnosis}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.treatment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Files & Prescriptions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Files & Prescriptions
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {file.fileName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {file.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {file.date}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAction(file.fileName, file.action)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {file.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
