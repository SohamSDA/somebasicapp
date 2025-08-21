"use client";

import { ModeToggle } from "@/components/toggle-dark-mode";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";

export function GlobalHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center gap-3">
        {/* Navigation Links */}
        {session?.user && (
          <div className="flex items-center gap-2">
            {pathname === "/dashboard" ? (
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Home
                </span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Dashboard
                </span>
              </Link>
            )}
          </div>
        )}

        {/* User Profile Section */}
        {session?.user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full shadow-sm">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {session.user.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {session.user.username}
            </span>
          </div>
        )}

        {/* Sign Out Button */}
        {session?.user && (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-300">
              Sign Out
            </span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full p-1 shadow-sm">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
