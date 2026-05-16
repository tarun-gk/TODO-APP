'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = authSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  // Mock login: Set a cookie with a demo user ID
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || 'demo-user-123';
  const cookieStore = await cookies();
  cookieStore.set('todo_user', userId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  redirect('/today');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = formData.get('display_name') as string;

  const result = authSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  if (!displayName || displayName.trim().length === 0) {
    return { error: 'Display name is required' };
  }

  // Mock signup: Set a cookie with a demo user ID
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || 'demo-user-123';
  const cookieStore = await cookies();
  cookieStore.set('todo_user', userId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  redirect('/today');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('todo_user');
  redirect('/login');
}
