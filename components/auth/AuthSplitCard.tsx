// components/auth/AuthSplitCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthSplitCardProps {
  title: string;
  children: ReactNode;

  rightTitle: string;
  rightText: string;
  rightButtonText: string;
  onRightButtonClick?: () => void;
  rightImageSrc?: string;
}

export default function AuthSplitCard({
  title,
  children,
  rightTitle,
  rightText,
  rightButtonText,
  onRightButtonClick,
  rightImageSrc = "/dog.png",
}: AuthSplitCardProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-12">
          {/* Left column */}
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
              {title}
            </h1>

            {children}
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between relative">
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {rightTitle}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{rightText}</p>

              <button
                type="button"
                onClick={onRightButtonClick}
                className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                {rightButtonText}
              </button>
            </div>

            <div className="flex justify-end mt-8">
              <div className="relative w-80 h-64">
                <Image
                  src={rightImageSrc}
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
