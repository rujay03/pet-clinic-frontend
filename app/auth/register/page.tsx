"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { SignupForm } from "@/types/auth";
import AuthSplitCard from "@/components/auth/AuthSplitCard";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMismatch = useMemo(() => {
    if (!form.confirmPassword) return false;
    return form.password !== form.confirmPassword;
  }, [form.password, form.confirmPassword]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // ✅ frontend validation first
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
        },
      });

      // ✅ signup success → go to login
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitCard
      title="Sign up"
      rightTitle="Already have an account?"
      rightText="If you already have an account, login to access your dashboard."
      rightButtonText="Go to Login"
      onRightButtonClick={() => router.push("/auth/login")}
    >
      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={[
              "w-full border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              passwordMismatch ? "border-red-400" : "border-gray-300",
            ].join(" ")}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            required
            autoComplete="new-password"
          />
          {passwordMismatch && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full text-white py-3 text-base font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#4F7FFF" }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthSplitCard>
  );
}
