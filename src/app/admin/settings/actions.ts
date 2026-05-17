'use server';

import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getSystemSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabaseAdmin
    .from('system_settings')
    .select('*');

  if (error) return {};

  const settings: Record<string, any> = {};
  (data ?? []).forEach((row: any) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function updateSettingAction(key: string, value: any): Promise<{ success: boolean; error?: string }> {
  await requireSuperAdmin();

  const { error } = await supabaseAdmin
    .from('system_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/settings');
  return { success: true };
}
