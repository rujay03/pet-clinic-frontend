"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to pet owner signup page
    router.replace("/auth/register/petowner");
  }, [router]);

  return null;
}
