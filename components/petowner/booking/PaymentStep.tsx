"use client";

import { useState } from "react";

interface PaymentStepProps {
  data: {
    paymentMethod: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  onNext: (data: {
    paymentMethod: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => void;
  onBack: () => void;
  submitting?: boolean;
}

export default function PaymentStep({
  data,
  onNext,
  onBack,
  submitting = false,
}: PaymentStepProps) {
  const [formData, setFormData] = useState({
    paymentMethod: data.paymentMethod || "Credit Card",
    cardName: data.cardName,
    cardNumber: data.cardNumber,
    expiryDate: data.expiryDate,
    cvv: data.cvv,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev) => ({ ...prev, cardNumber: digits }));
      return;
    }

    if (name === "cvv") {
      const digits = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, cvv: digits }));
      return;
    }

    if (name === "expiryDate") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
          : digits;
      setFormData((prev) => ({ ...prev, expiryDate: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Payment Details
        </h2>

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              inputMode="numeric"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="4111111111111111"
              maxLength={16}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              required
            />
          </div>

          {/* Card Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Budi Similikwaw"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                inputMode="numeric"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="07/28"
                maxLength={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                inputMode="numeric"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="000"
                maxLength={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </form>
  );
}
