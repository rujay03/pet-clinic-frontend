// components/admin/AdminProfile.tsx
"use client";

export interface AdminProfileProps {
  userEmail?: string;
}

export default function AdminProfile({ userEmail }: AdminProfileProps) {
  return (
    <div className="fixed bottom-6 left-6 w-52">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border-2 border-white/40">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg mb-1">
            {userEmail?.split("@")[0] || "Admin"}
          </h3>

          {/* Description */}
          <p className="text-xs text-white/80 leading-relaxed">
            System Administrator
          </p>
        </div>
      </div>
    </div>
  );
}

