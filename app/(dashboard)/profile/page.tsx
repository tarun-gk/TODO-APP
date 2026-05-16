import { redirect } from 'next/navigation';
import { logout } from '@/app/auth/actions';
import { Button } from '@/components/ui/Button';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('todo_user')?.value;

  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">User ID</h3>
          <p className="mt-1 text-base">{userId}</p>
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
