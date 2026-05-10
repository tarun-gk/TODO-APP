import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import TaskList from '@/components/TaskList';
import QuickAdd from '@/components/QuickAdd';
import { Task } from '@/types';

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch today's tasks
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('due_date', today)
    .order('position', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Today</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
      </div>

      <QuickAdd />
      
      <TaskList initialTasks={(tasks as Task[]) || []} />
    </div>
  );
}
