"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { StaffSignupForm } from "@/types/auth";
import AuthSplitCard from "@/components/auth/AuthSplitCard";
import OtpVerification from "@/components/auth/OtpVerification";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validatePassword, formatPhoneNumber, getPasswordRequirements } from "@/lib/validation";

export default function StaffRegisterPage() {
  const router = useRouter();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [form, setForm] = useState<StaffSignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    contactNo: "",
    role: "DOCTOR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordMismatch = useMemo(() => {
    if (!form.confirmPassword) return false;
    return form.password !== form.confirmPassword;
  }, [form.password, form.confirmPassword]);

  const passwordRequirements = useMemo(() => {
    return getPasswordRequirements(form.password);
  }, [form.password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Frontend validation
    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/auth/signup/staff", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          contactNo: form.contactNo || undefined,
          role: form.role,
        },
      });

      // Show OTP verification screen
      setShowOtpVerification(true);
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

  // If OTP verification is shown, render that component
  if (showOtpVerification) {
    return (
      <OtpVerification
        email={form.email}
        signupData={{
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          contactNo: form.contactNo || undefined,
          role: form.role,
        }}
        userType="staff"
        onBack={() => setShowOtpVerification(false)}
      />
    );
  }

  return (
    <AuthSplitCard
      title="Staff Registration"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="fullName"
          >
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            required
            autoComplete="name"
          />
        </div>

        {/* Email */}
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            autoComplete="email"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="contactNo"
          >
            Contact Number
          </label>
          <input
            id="contactNo"
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.contactNo}
            onChange={(e) => {
              const numericValue = formatPhoneNumber(e.target.value);
              setForm((prev) => ({ ...prev, contactNo: numericValue }));
            }}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            autoComplete="tel"
            placeholder="0719966965"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={10}
          />
        </div>

        {/* Role Selection */}
        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="role"
          >
            Role<span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
            required
          >
            <option value="DOCTOR">Doctor</option>
            <option value="PHARMACIST">Pharmacist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Password */}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.password}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, password: value }));
              }}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {form.password && passwordRequirements.some(req => !req.met) && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.filter(req => !req.met).map((req, index) => (
                <p
                  key={index}
                  className="text-xs text-red-600 flex items-center gap-1"
                >
                  <span>✗</span>
                  <span>{req.text}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
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
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
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
          {loading ? "Creating account..." : "Create Account"}
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

