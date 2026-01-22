// app/pharmacy-staff/medicine/add/page.tsx
import PharmacyShell from "@/components/pharmacy-staff/PharmacyShell";
import AddMedicineForm from "@/components/pharmacy-staff/medicine/AddMedicineForm";

export default function AddMedicinePage() {
  return (
    <PharmacyShell>
      <div className="p-8">
        <AddMedicineForm />
      </div>
    </PharmacyShell>
  );
}
