// components/appointments/AppointmentHistoryTable.tsx
interface AppointmentHistoryItem {
  date: string;
  petName: string;
  note: string;
  type: string;
}

interface AppointmentHistoryTableProps {
  items: AppointmentHistoryItem[];
}

export default function AppointmentHistoryTable({
  items,
}: AppointmentHistoryTableProps) {
  return (
    <section className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Appointment History
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Pet Name</th>
              <th className="px-6 py-3">Note</th>
              <th className="px-6 py-3">Appointment Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={`${item.date}-${item.petName}-${item.type}`}>
                <td className="px-6 py-3 text-slate-700">{item.date}</td>
                <td className="px-6 py-3 text-slate-700">{item.petName}</td>
                <td className="px-6 py-3 text-slate-500">{item.note}</td>
                <td className="px-6 py-3 text-slate-700">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
