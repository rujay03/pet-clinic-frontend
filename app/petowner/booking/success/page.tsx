"use client";

import { useRouter } from "next/navigation";

export default function BookingSuccessPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/petowner/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-12 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="mb-12 text-3xl font-bold text-gray-900">
            Booking Confirmed
          </h1>

          {/* Success Illustration */}
          <div className="relative mb-12 flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute h-64 w-64 rounded-full bg-[#FEF3C7] opacity-50"></div>

            {/* Check badge */}
            <div className="absolute left-8 top-8 z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1] shadow-lg">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Thumbs up illustration */}
            <div className="relative z-0 flex items-center justify-center">
              {/* Medicine/Bandage */}
              <div className="relative">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bandage/Medicine background */}
                  <rect
                    x="40"
                    y="60"
                    width="100"
                    height="80"
                    rx="8"
                    fill="#C4F1BE"
                    transform="rotate(-15 90 100)"
                  />

                  {/* Cross marks on bandage */}
                  <line
                    x1="80"
                    y1="90"
                    x2="80"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    transform="rotate(-15 80 100)"
                  />
                  <line
                    x1="70"
                    y1="100"
                    x2="90"
                    y2="100"
                    stroke="#374151"
                    strokeWidth="2"
                    transform="rotate(-15 80 100)"
                  />

                  <line
                    x1="100"
                    y1="90"
                    x2="100"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    transform="rotate(-15 100 100)"
                  />
                  <line
                    x1="90"
                    y1="100"
                    x2="110"
                    y2="100"
                    stroke="#374151"
                    strokeWidth="2"
                    transform="rotate(-15 100 100)"
                  />
                </svg>

                {/* Thumb */}
                <div className="absolute bottom-0 right-0 translate-x-8 translate-y-4">
                  <svg
                    width="100"
                    height="120"
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Sleeve */}
                    <rect
                      x="10"
                      y="80"
                      width="40"
                      height="35"
                      rx="4"
                      fill="#A78BFA"
                    />

                    {/* Thumb up */}
                    <path
                      d="M30 80 L30 50 C30 40 35 35 42 35 C48 35 50 40 50 45 L50 30 C50 20 55 15 62 15 C68 15 72 20 72 28 L72 60 C72 65 68 70 63 70 L45 70 C38 70 33 75 33 80 Z"
                      fill="#FBBF24"
                    />

                    {/* Finger lines */}
                    <path
                      d="M45 40 Q48 35 50 30"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="max-w-md text-base leading-relaxed text-gray-600">
            Thank you for caring to your pet and trust Pawcare services! Here's
            your booking information. You can let our receptionist know by
            showing your booking ID
          </p>

          {/* Optional: Booking ID or action button */}
          <button
            onClick={handleClose}
            className="mt-8 rounded-lg bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5558E3]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
