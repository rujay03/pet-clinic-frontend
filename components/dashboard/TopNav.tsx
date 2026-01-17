// components/dashboard/TopNav.tsx

interface TopNavProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function TopNav({ userEmail, onLogout }: TopNavProps) {
  return (
    <header className="w-full bg-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: logo + brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-700">
            <span className="text-sm font-semibold">PC</span>
          </div>
          <span className="text-lg font-semibold">PetCare</span>
        </div>

        {/* Center: navigation links */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <button className="font-medium text-white">Dashboard</button>
          <button className="text-slate-200 hover:text-white">
            Appointments
          </button>
          <button className="text-slate-200 hover:text-white">
            Pet records
          </button>
        </nav>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden text-xs text-slate-200 md:inline">
              {userEmail}
            </span>
          )}
          <button
            onClick={onLogout}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 hover:bg-white"
          >
            Log out
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-900">
            {/* Simple avatar placeholder */}
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
