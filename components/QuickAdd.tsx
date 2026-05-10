'use client';

import { useState } from 'react';
import { addTask } from '@/app/actions/taskActions';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function QuickAdd() {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addTask(title.trim());
      setTitle('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <div className="absolute left-3 text-zinc-400">
        <Plus className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Add a task for today..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        className="pl-10 h-12 w-full text-base bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
      />
    </form>
  );
}
