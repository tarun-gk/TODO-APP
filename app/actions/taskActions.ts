// app/actions/taskActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import { getDb } from '@/lib/mongodb/client';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

async function getUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('todo_user')?.value;
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}

export async function addTask(title: string, dueDate?: string) {
  const userId = await getUserId();
  const db = await getDb();
  const collection = db.collection('tasks');

  const doc = {
    title,
    user_id: userId,
    due_date: dueDate || format(new Date(), 'yyyy-MM-dd'),
    created_at: new Date(),
    completed_at: null,
  };

  const result = await collection.insertOne(doc);
  if (!result.acknowledged) {
    throw new Error('Failed to add task');
  }

  revalidatePath('/today');
  return { _id: result.insertedId, ...doc };
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const userId = await getUserId();
  const db = await getDb();
  const collection = db.collection('tasks');

  const completedAt = isCompleted ? new Date() : null;
  const result = await collection.updateOne(
    { _id: new ObjectId(taskId), user_id: userId },
    { $set: { completed_at: completedAt } }
  );

  if (result.matchedCount === 0) {
    throw new Error('Task not found');
  }

  revalidatePath('/today');
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  const db = await getDb();
  const collection = db.collection('tasks');

  const result = await collection.deleteOne({ _id: new ObjectId(taskId), user_id: userId });
  if (result.deletedCount === 0) {
    throw new Error('Task not found');
  }

  revalidatePath('/today');
}
