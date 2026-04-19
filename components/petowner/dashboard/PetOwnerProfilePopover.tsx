"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type { MeResponse, UpdateMyProfileRequest } from "@/types/auth";

interface PetOwnerProfilePopoverProps {
  user?: MeResponse | null;
  onSaved?: () => void | Promise<void>;
  onClose: () => void;
}

interface ProfileFormState {
  fullName: string;
  contactNo: string;
  address: string;
}

function toFormState(user?: MeResponse | null): ProfileFormState {
  return {
    fullName: user?.fullName?.trim() || "",
    contactNo: user?.contactNo?.trim() || "",
    address: user?.address?.trim() || "",
  };
}

export default function PetOwnerProfilePopover({
  user,
  onSaved,
  onClose,
}: PetOwnerProfilePopoverProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormState>(() => toFormState(user));

  useEffect(() => {
    setForm(toFormState(user));
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  }, [user]);

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(toFormState(user));
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: UpdateMyProfileRequest = {
      fullName: form.fullName.trim(),
      contactNo: form.contactNo.trim(),
      address: form.address.trim() || null,
    };

    if (!payload.fullName) {
      setError("Full name is required.");
      return;
    }

    if (!payload.contactNo) {
      setError("Contact number is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      await apiFetch<MeResponse>("/api/auth/me", {
        method: "PUT",
        body: payload,
      });

      await onSaved?.();
      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to update profile.");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">My profile</h3>
        <button
          onClick={onClose}
          type="button"
          className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          />
        </div>

        <div>
          <label htmlFor="profile-full-name" className="mb-1 block text-xs font-medium text-slate-600">
            Full name
          </label>
          <input
            id="profile-full-name"
            type="text"
            value={form.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            disabled={!isEditing || isSaving}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
          />
        </div>

        <div>
          <label htmlFor="profile-contact" className="mb-1 block text-xs font-medium text-slate-600">
            Contact number
          </label>
          <input
            id="profile-contact"
            type="text"
            value={form.contactNo}
            onChange={(event) => handleChange("contactNo", event.target.value)}
            disabled={!isEditing || isSaving}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
          />
        </div>

        <div>
          <label htmlFor="profile-address" className="mb-1 block text-xs font-medium text-slate-600">
            Address
          </label>
          <textarea
            id="profile-address"
            rows={2}
            value={form.address}
            onChange={(event) => handleChange("address", event.target.value)}
            disabled={!isEditing || isSaving}
            className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {successMessage && <p className="text-xs text-emerald-600">{successMessage}</p>}

        <div className="flex justify-end gap-2 pt-1">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

