// components/doctor/DoctorProfile.tsx
"use client";

export interface DoctorProfileProps {
  userEmail?: string;
}

export default function DoctorProfile({ userEmail }: DoctorProfileProps) {
  return (
    <div className="fixed bottom-6 left-6 w-52">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border-2 border-white/40">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg mb-1">
            {userEmail?.split("@")[0] || "Doctor"}
          </h3>

          {/* Description */}
          <p className="text-xs text-white/80 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit
          </p>
        </div>
      </div>
    </div>
  );
}
