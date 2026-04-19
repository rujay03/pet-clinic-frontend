"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/lib/auth-utils";
import { ApiError } from "@/lib/api";
import type { LoginRequest } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get("verified") === "true") {
      setSuccessMessage(
        "Email verified successfully! You can now login to your account."
      );
    }

    if (searchParams.get("passwordReset") === "true") {
      setSuccessMessage(
        "Password reset successful! Please login with your new password."
      );
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await login(form.email, form.password);

      // Use returned user data to determine dashboard route
      const dashboardRoute = getDashboardRoute(userData);
      router.replace(dashboardRoute);
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-12">
          {/* Left Column - Login Form */}
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 w-fit transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <h1
              className="text-5xl font-bold mb-8"
              style={{ color: "#4F7FFF" }}
            >
              Login
            </h1>

            {successMessage && (
              <div className="mb-4 rounded bg-green-100 text-green-700 px-3 py-2 text-sm">
                {successMessage}
              </div>
            )}

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
                  Mobile Number / Email
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full text-white py-3 text-base font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                style={{ backgroundColor: "#4F7FFF" }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Social login section removed */}
          </div>

          {/* Right Column - Info Section */}
          <div className="flex flex-col justify-between relative">
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Don&apos;t have an account?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sign up as a pet owner or register as staff to access the system.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/auth/register/petowner")}
                  className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                >
                  Sign Up as Pet Owner
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/auth/register/staff")}
                  className="px-8 py-3 rounded-full border-2 border-gray-400 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Register as Staff
                </button>
              </div>
            </div>

            {/* Dog Image */}
            <div className="flex justify-end mt-8">
              <div className="relative w-80 h-64">
                <Image
                  src="/dog.png"
                  alt="Pet dog"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
