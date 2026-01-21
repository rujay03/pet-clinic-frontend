// components/appointments/AppointmentSummaryCard.tsx
import Image from "next/image";

interface AppointmentSummaryCardProps {
  petName: string;
  breed: string;
  ageLabel: string;
  note: string;
}

export default function AppointmentSummaryCard({
  petName,
  breed,
  ageLabel,
  note,
}: AppointmentSummaryCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200">
          <Image src="/dog.png" alt={petName} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{petName}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
              {breed}
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
              {ageLabel}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{note}</p>
    </div>
  );
}
