import { supabase } from './supabase';
import { Peminjaman, PeminjamanInput, PeminjamanStatus } from '../types/peminjaman';

// ===================== CREATE =====================

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

// ===================== READ =====================

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

export const getAllPeminjaman = async (): Promise<Peminjaman[]> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching peminjaman:', error);
    throw new Error(error.message);
  }

  return data as Peminjaman[];
};

export const getPeminjamanById = async (id: number): Promise<Peminjaman | null> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .eq('peminjaman_id', id)
    .single();

  if (error) {
    console.error('Error fetching peminjaman by id:', error);
    return null;
  }

  return data as Peminjaman;
};

// ===================== UPDATE =====================

export const updatePeminjamanStatus = async (
  id: number,
  status: PeminjamanStatus
): Promise<Peminjaman> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .update({ status })
    .eq('peminjaman_id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating peminjaman status:', error);
    throw new Error(error.message);
  }

  return data as Peminjaman;
};