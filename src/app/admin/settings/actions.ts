'use server';

import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSystemSettings, JsonValue } from '@/lib/settings';
import { revalidatePath } from 'next/cache';

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

export { getSystemSettings };

export async function updateSettingAction(key: string, value: JsonValue): Promise<{ success: boolean; error?: string }> {
  await requireSuperAdmin();

  const { error } = await supabaseAdmin
    .from('system_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/settings');
  return { success: true };
}
