'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { toggleTask, deleteTask } from '@/app/actions/taskActions';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggle = async (task: Task) => {
    const isCompleted = !task.completed_at;
    
    // Optimistic update
    setTasks(current => 
      current.map(t => 
        t.id === task.id ? { ...t, completed_at: isCompleted ? new Date().toISOString() : null } : t
      )
    );

    try {
      await toggleTask(task.id, isCompleted);
    } catch (error) {
      // Revert on error
      setTasks(current => 
        current.map(t => 
          t.id === task.id ? { ...t, completed_at: task.completed_at } : t
        )
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    // Optimistic update
    setTasks(current => current.filter(t => t.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (error) {
      // Could revert here or show toast
      window.location.reload();
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No tasks for today. Enjoy your day!</p>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => !t.completed_at);
  const completedTasks = tasks.filter(t => !!t.completed_at);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {activeTasks.map((task) => (
          <div key={task.id} className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleToggle(task)}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 text-transparent hover:border-blue-500 hover:text-blue-500 dark:border-zinc-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.title}</span>
            </div>
            <button 
              onClick={() => handleDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Completed</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 opacity-75 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggle(task)}
                  className="flex h-5 w-5 items-center justify-center rounded-full border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-medium text-zinc-500 line-through dark:text-zinc-400">{task.title}</span>
              </div>
              <button 
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
