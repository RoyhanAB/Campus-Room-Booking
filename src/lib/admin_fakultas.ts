import { supabase } from './supabase';
import { AdminFakultasJoined } from '@/types/admin_fakultas'; 

export const getAdminInfo = async (userId: string): Promise<AdminFakultasJoined | null> => {
  const { data, error } = await supabase
    .from('admin_fakultas')
    .select(`
      user_id,
      fakultas_id,
      user:user_id (user_name),
      fakultas:fakultas_id (fakultas_name)
    `)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    // Only log for real errors, not "no rows found"
    if (!error.message.includes('coerce')) {
      console.error(`Error fetching admin info for user ${userId}:`, error.message);
    }
    return null; 
  }

  return data as unknown as AdminFakultasJoined;
};