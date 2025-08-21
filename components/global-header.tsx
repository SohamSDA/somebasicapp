"use client";

import { ModeToggle } from "@/components/toggle-dark-mode";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, LayoutDashboard } from "lucide-react";

export function GlobalHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Home</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard</span>
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
        
        {/* Dark Mode Toggle */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full p-1 shadow-sm">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
