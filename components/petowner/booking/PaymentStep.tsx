"use client";

import { useState } from "react";

interface PaymentStepProps {
  data: {
    paymentMethod: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    petName: string;
    note: string;
    selectedDate: Date | null;
    selectedTime: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function PaymentStep({
  data,
  onNext,
  onBack,
}: PaymentStepProps) {
  const [formData, setFormData] = useState({
    paymentMethod: data.paymentMethod,
    cardName: data.cardName,
    cardNumber: data.cardNumber,
    expiryDate: data.expiryDate,
    cvv: data.cvv,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-[1fr_340px] gap-8">
        {/* Left: Payment Form */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Payment</h2>

          <div className="space-y-4">
            {/* Payment Method */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose Payment Method
              </label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Card Name
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

            {/* Card Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="012345678 1234"
                maxLength={16}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                required
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expired Card
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="07/25"
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

        {/* Right: Booking Summary */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="space-y-6">
            {/* Pet Info */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-300">
                <img
                  src="/api/placeholder/64/64"
                  alt={data.petName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {data.petName || "Lucy"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                    Golden Retriever
                  </span>
                  <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                    Female, 2 y.o
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            {data.note && <p className="text-sm text-gray-600">{data.note}</p>}

            {/* Appointment Details */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {data.selectedDate
                    ? `${formatDate(data.selectedDate)}, ${formatTime(
                        data.selectedTime,
                      )}`
                    : "15 July 2024, 03:00 PM"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Pet House Bintaro</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Anna Nurhalimah</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5558E3]"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
