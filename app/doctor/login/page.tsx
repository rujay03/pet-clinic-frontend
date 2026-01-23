"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { LoginRequest } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: form,
      });

      // ✅ If no error → session cookie is set, redirect to doctor dashboard
      router.push("/doctor/dashboard");
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

            <h1 className="text-4xl font-bold mb-2 text-gray-900">Sign In</h1>
            <p className="text-sm text-gray-500 mb-8">
              Enter your email and password to sign in!
            </p>

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
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="mail@simmmple.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      {!showPassword && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                    style={{ accentColor: "#4F7FFF" }}
                  />
                  Keep me logged in
                </label>
                <Link
                  href="/doctor/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: "#4F7FFF" }}
                >
                  Forget password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full text-white py-3 text-base font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                style={{ backgroundColor: "#4F7FFF" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Not registered yet?{" "}
                <Link
                  href="/doctor/register"
                  className="font-medium hover:underline"
                  style={{ color: "#4F7FFF" }}
                >
                  Create an Account
                </Link>
              </p>
            </form>
          </div>

          {/* Right Column - Image */}
          <div className="flex flex-col justify-between relative">
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                New to Pet Core?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To register as a doctor on Pet Core, please contact the admin at
                071-22-33-465.
              </p>

              <button
                type="button"
                onClick={() => router.push("/doctor/register")}
                className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Contact Admin
              </button>
            </div>

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

        {/* Footer */}
        <div className="px-12 pb-6 text-center">
          <p className="text-xs text-gray-400">
            © 2025 Pet Core. All Rights Reserved. Developed by Ruwanthi
          </p>
        </div>
      </div>
    </main>
  );
}
