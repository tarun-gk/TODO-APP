import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import TaskList from '@/components/TaskList';
import QuickAdd from '@/components/QuickAdd';
import { Task } from '@/types';
import { getDb } from '@/lib/mongodb/client';
import { cookies } from 'next/headers';

export default async function TodayPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('todo_user')?.value;

  if (!userId) {
    redirect('/login');
  }

  const db = await getDb();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Fetch today's tasks
  const tasks = await db.collection('tasks')
    .find({ user_id: userId, due_date: today })
    .sort({ position: 1 })
    .toArray();

  // Convert _id to id for the frontend component
  const serializedTasks = tasks.map(t => ({
    ...t,
    id: t._id.toString(),
    _id: undefined
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Today</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
      </div>

      <QuickAdd />
      
      <TaskList initialTasks={(serializedTasks as unknown as Task[]) || []} />
    </div>
  );
}
