import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/app/auth/actions';
import { Button } from '@/components/ui/Button';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</h3>
          <p className="mt-1 text-base">{user.email}</p>
        </div>
        
        <form action={logout}>
          <Button type="submit" variant="destructive" className="mt-4">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
