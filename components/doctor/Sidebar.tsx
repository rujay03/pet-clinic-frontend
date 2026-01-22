// components/doctor/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth tokens
    localStorage.removeItem("token");
    router.push("/doctor/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
    },
    {
      name: "Log out",
      href: "#",
      isLogout: true,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">PET CORE</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href && !item.isLogout;

          if (item.isLogout) {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 w-full transition-colors"
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
