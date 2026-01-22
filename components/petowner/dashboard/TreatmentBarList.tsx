// components/dashboard/TreatmentBarList.tsx

interface TreatmentItem {
  label: string;
  value: number; // percentage 0–100
}

interface TreatmentBarListProps {
  items: TreatmentItem[];
}

export default function TreatmentBarList({ items }: TreatmentBarListProps) {
  const max = Math.max(...items.map((i) => i.value), 100);

  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900"
              style={{
                width: `${(item.value / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
