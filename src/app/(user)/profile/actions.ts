'use server';

import { getSession, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const session = await getSession();
  if (!session) return { error: 'Silakan login terlebih dahulu.', success: false };

  const jurusan = formData.get('jurusan') as string;
  const angkatan = formData.get('angkatan') as string;

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      user_id: session.user_id,
      jurusan: jurusan?.trim() || '',
      angkatan: angkatan?.trim() || '',
    });

  if (error) return { error: error.message, success: false };

  revalidatePath('/profile');
  return { error: '', success: true };
}

export async function changePasswordAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const session = await getSession();
  if (!session) return { error: 'Silakan login terlebih dahulu.', success: false };

  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!currentPassword || !newPassword) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  if (newPassword.length < 6) {
    return { error: 'Password baru minimal 6 karakter.', success: false };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password tidak cocok.', success: false };
  }

  // Verify current password
  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('user_id', session.user_id)
    .single();

  if (!user) return { error: 'User tidak ditemukan.', success: false };

  let passwordValid = false;
  if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
    passwordValid = await bcrypt.compare(currentPassword, user.password);
  } else {
    passwordValid = user.password === currentPassword;
  }

  if (!passwordValid) {
    return { error: 'Password saat ini salah.', success: false };
  }

  // Update to new hashed password
  const hashedPassword = await hashPassword(newPassword);
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ password: hashedPassword })
    .eq('user_id', session.user_id);

  if (updateError) return { error: updateError.message, success: false };

  return { error: '', success: true };
}
