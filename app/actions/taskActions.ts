'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

export async function addTask(title: string, dueDate?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      due_date: dueDate || format(new Date(), 'yyyy-MM-dd'),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task');
  }

  revalidatePath('/today');
  return data;
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const completedAt = isCompleted ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('tasks')
    .update({ completed_at: completedAt })
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error toggling task:', error);
    throw new Error('Failed to toggle task');
  }

  revalidatePath('/today');
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }

  revalidatePath('/today');
}
