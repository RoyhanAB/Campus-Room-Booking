import { supabase } from './supabase';
import { Peminjaman, PeminjamanInput } from '../types/peminjaman';

export const createPeminjaman = async (payload: PeminjamanInput): Promise<Peminjaman> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .insert({
      ...payload,
      dokumen: payload.dokumen ?? '',
      status: payload.status ?? 'menunggu',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating peminjaman:', error);
    throw new Error(error.message);
  }

  return data as Peminjaman;
};

export const getRecentPeminjaman = async (limit = 30): Promise<Peminjaman[]> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching peminjaman:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as Peminjaman[];
};