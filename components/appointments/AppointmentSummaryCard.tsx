// components/appointments/AppointmentSummaryCard.tsx
import Image from "next/image";

export interface OngoingAppointmentBrief {
  id: string;
  time: string;
  title: string;
  status?: "Scheduled" | "In Progress" | "Completed";
}

interface AppointmentSummaryCardProps {
  petName: string;
  breed: string;
  ageLabel: string;
  note: string;
  ongoingAppointments?: OngoingAppointmentBrief[];
  onSelectAppointment?: (id: string) => void;
}

export default function AppointmentSummaryCard({
  petName,
  breed,
  ageLabel,
  note,
  ongoingAppointments = [],
  onSelectAppointment,
}: AppointmentSummaryCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-50 p-6 shadow-sm h-full">
      {/* Pet Details Section */}
      <div className="flex-shrink-0">
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

      {/* Ongoing Appointments Section */}
      <div className="mt-6 flex flex-col min-h-0 flex-1">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 flex-shrink-0">
          Ongoing Appointments
        </h4>

        {ongoingAppointments.length === 0 ? (
          <p className="text-xs text-slate-400">
            No ongoing appointments for this day.
          </p>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1">
            {ongoingAppointments.map((appt) => (
              <button
                key={appt.id}
                type="button"
                onClick={() => onSelectAppointment?.(appt.id)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs hover:border-blue-500 hover:bg-blue-50 flex-shrink-0"
              >
                <div>
                  <p className="font-medium text-slate-800">{appt.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {appt.time}
                  </p>
                </div>
                {appt.status && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                    {appt.status}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
