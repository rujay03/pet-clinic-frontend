"use client";

import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();

  // Redirect to appointments page since booking is now a modal
  if (typeof window !== "undefined") {
    router.replace("/petowner/appointments");
  }

  return null;
}
