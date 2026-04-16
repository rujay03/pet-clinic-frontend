"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getPasswordRequirements, validatePassword } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordRequirements = useMemo(() => {
    return getPasswordRequirements(newPassword);
  }, [newPassword]);

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const message = await apiFetch<string>("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });

      setSuccessMessage(
        typeof message === "string"
          ? message
          : "If an account exists for that email, an OTP has been sent."
      );
      setStep("reset");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to request OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError(null);
    setSuccessMessage(null);
    setResending(true);

    try {
      const message = await apiFetch<string>("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });

      setSuccessMessage(
        typeof message === "string"
          ? message
          : "If an account exists for that email, an OTP has been sent."
      );
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setResending(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: { email, otpCode, newPassword },
      });

      router.push("/auth/login?passwordReset=true");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8">
        <Link
          href="/auth/login"
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
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <h1 className="text-3xl font-bold mb-3 text-gray-900">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          {step === "request"
            ? "Enter your email and we will send a 6-digit OTP code."
            : "Enter the OTP and set a new password."}
        </p>

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

        {step === "request" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full text-white py-3 text-base font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: "#4F7FFF" }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700"
                value={email}
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="otpCode"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                OTP Code
              </label>
              <input
                id="otpCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {newPassword && passwordRequirements.some((req) => !req.met) && (
              <div className="space-y-1">
                {passwordRequirements
                  .filter((req) => !req.met)
                  .map((req, index) => (
                    <p key={index} className="text-xs text-red-600">
                      - {req.text}
                    </p>
                  ))}
              </div>
            )}

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full text-white py-3 text-base font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: "#4F7FFF" }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="w-full rounded-full border border-gray-300 text-gray-700 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              {resending ? "Resending OTP..." : "Resend OTP"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

