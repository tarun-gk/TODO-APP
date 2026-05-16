import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 dark:text-white">
            Work in Consistency
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your productivity, gamified.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
