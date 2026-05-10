'use server';

import { login, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = formData.get('userId') as string;
  const password = formData.get('password') as string;

  if (!userId || !password) {
    return { error: 'User ID dan Password wajib diisi.' };
  }

  const result = await login(userId.trim(), password);

  if (!result.success) {
    return { error: result.error || 'Login gagal.' };
  }

  // Redirect berdasarkan role
  const role = result.user?.role;
  if (role === 'admin_fakultas') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/login');
}
