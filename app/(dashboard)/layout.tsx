import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Trophy, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 md:pl-64">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        <div className="mx-auto flex w-full max-w-md items-center justify-around px-6">
          <Link href="/today" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Today</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
            <Trophy className="h-6 w-6" />
            <span className="text-xs font-medium">Leaderboard</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-zinc-200 md:bg-white md:dark:border-zinc-800 md:dark:bg-zinc-900">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-2xl font-extrabold text-primary">Work in Consistency</h1>
          </div>
          <div className="mt-8 flex flex-1 flex-col gap-2 px-2">
            <Link href="/today" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              <Home className="mr-3 h-5 w-5 flex-shrink-0" />
              Today
            </Link>
            <Link href="/leaderboard" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              <Trophy className="mr-3 h-5 w-5 flex-shrink-0" />
              Leaderboard
            </Link>
            <Link href="/profile" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              <User className="mr-3 h-5 w-5 flex-shrink-0" />
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
