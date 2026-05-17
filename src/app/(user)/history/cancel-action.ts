'use server';

import { cancelPeminjaman } from '@/lib/peminjaman';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function cancelBookingAction(peminjamanId: number): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Silakan login terlebih dahulu.' };
  }

  try {
    await cancelPeminjaman(peminjamanId, session.user_id);
    revalidatePath('/history');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal membatalkan peminjaman.',
    };
  }
}
