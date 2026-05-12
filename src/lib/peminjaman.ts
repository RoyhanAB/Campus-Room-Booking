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

// Sorted: Menunggu first, then by date (newest first)
export const getAllPeminjamanSorted = async (): Promise<Peminjaman[]> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*');

  if (error) {
    console.error('Error fetching peminjaman:', error);
    throw new Error(error.message);
  }

  // Sort in memory: menunggu first, then by created_at desc
  const sorted = (data as Peminjaman[]).sort((a, b) => {
    // Priority: menunggu > disetujui/ditolak
    const statusA = a.status?.toLowerCase() === 'menunggu' ? 0 : 1;
    const statusB = b.status?.toLowerCase() === 'menunggu' ? 0 : 1;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    // Same status, sort by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return sorted;
};

// Get peminjaman filtered by admin's fakultas
export const getPeminjamanByFakultas = async (fakultasId: number): Promise<Peminjaman[]> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select(`
      *,
      rooms!inner (
        building_id,
        buildings!inner (
          fakultas_id
        )
      )
    `)
    .eq('rooms.buildings.fakultas_id', fakultasId);

  if (error) {
    console.error('Error fetching peminjaman by fakultas:', error);
    throw new Error(error.message);
  }

  // Sort in memory: menunggu first, then by created_at desc
  const sorted = (data as any[]).map(item => ({
    peminjaman_id: item.peminjaman_id,
    room_id: item.room_id,
    user_id: item.user_id,
    nama_kegiatan: item.nama_kegiatan,
    tanggal_dimulai: item.tanggal_dimulai,
    tanggal_selesai: item.tanggal_selesai,
    deskripsi: item.deskripsi,
    jumlah_peserta: item.jumlah_peserta,
    dokumen: item.dokumen,
    status: item.status,
    alasan_penolakan: item.alasan_penolakan,
    created_at: item.created_at,
  } as Peminjaman)).sort((a, b) => {
    const statusA = a.status?.toLowerCase() === 'menunggu' ? 0 : 1;
    const statusB = b.status?.toLowerCase() === 'menunggu' ? 0 : 1;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return sorted;
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
  status: PeminjamanStatus,
  alasanPenolakan?: string
): Promise<Peminjaman> => {
  const updateData: { status: PeminjamanStatus; alasan_penolakan?: string } = { status };
  
  if (status === 'ditolak' && alasanPenolakan) {
    updateData.alasan_penolakan = alasanPenolakan;
  }

  const { data, error } = await supabase
    .from('peminjaman')
    .update(updateData)
    .eq('peminjaman_id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating peminjaman status:', error);
    throw new Error(error.message);
  }

  return data as Peminjaman;
};