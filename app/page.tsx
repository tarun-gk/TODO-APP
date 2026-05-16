import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('todo_user')?.value;

  if (userId) {
    redirect('/today');
  } else {
    redirect('/login');
  }
}
