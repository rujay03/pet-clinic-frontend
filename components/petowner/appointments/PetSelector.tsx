// components/appointments/PetSelector.tsx
interface PetSelectorProps {
  selectedPetId: string;
  pets: { id: string; name: string }[];
  onChange: (id: string) => void;
  onNewAppointment: () => void;
}

export default function PetSelector({
  selectedPetId,
  pets,
  onChange,
  onNewAppointment,
}: PetSelectorProps) {
  return (
    <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-end md:justify-end">
      <div className="flex flex-col">
        <label
          htmlFor="pet"
          className="mb-1 text-xs font-medium text-slate-600"
        >
          Select your pet
        </label>
        <select
          id="pet"
          value={selectedPetId}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        >
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onNewAppointment}
        className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New Appointment
      </button>
    </div>
  );
}
