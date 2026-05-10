'use client';

import { useActionState } from 'react';
import { signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await signup(formData);
    },
    null
  );

  return (
    <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form action={formAction} className="space-y-6">
        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <div className="mt-1">
            <Input
              id="display_name"
              name="display_name"
              type="text"
              autoComplete="name"
              required
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full"
            />
          </div>
        </div>

        {state?.error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {state.error}
          </div>
        )}

        <div>
          <SubmitButton />
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Sign in
        </Link>
      </div>
    </div>
  );
}
