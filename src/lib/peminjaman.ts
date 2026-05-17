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

// Get recent peminjaman filtered by admin's fakultas
export const getRecentPeminjamanByFakultas = async (fakultasId: number, limit = 5): Promise<Peminjaman[]> => {
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
    .eq('rooms.buildings.fakultas_id', fakultasId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent peminjaman by fakultas:', error);
    return [];
  }

  return (data ?? []).map((item: any) => ({
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
  } as Peminjaman));
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

// Get peminjaman by ID with user name joined
export const getPeminjamanById = async (id: number): Promise<Peminjaman | null> => {
  const { data, error } = await supabase
    .from('peminjaman')
    .select(`
      *,
      users:user_id (user_name),
      rooms:room_id (kapasitas)
    `)
    .eq('peminjaman_id', id)
    .single();

  if (error) {
    console.error('Error fetching peminjaman by id:', error);
    return null;
  }

  const item = data as any;
  return {
    ...item,
    user_name: item.users?.user_name || null,
    room_kapasitas: item.rooms?.kapasitas || null,
    users: undefined,
    rooms: undefined,
  } as Peminjaman;
};

// Count peminjaman by status, optionally filtered by fakultas
export const countPeminjamanByStatus = async (
  status: string,
  fakultasId?: number
): Promise<number> => {
  try {
    if (fakultasId) {
      const { data, error } = await supabase
        .from('peminjaman')
        .select(`
          peminjaman_id,
          rooms!inner (
            building_id,
            buildings!inner (
              fakultas_id
            )
          )
        `)
        .eq('status', status)
        .eq('rooms.buildings.fakultas_id', fakultasId);

      if (error) return 0;
      return data?.length ?? 0;
    } else {
      const { count } = await supabase
        .from('peminjaman')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      return count ?? 0;
    }
  } catch {
    return 0;
  }
};

// Count total rooms, optionally filtered by fakultas
export const countRoomsByFakultas = async (fakultasId?: number): Promise<number> => {
  try {
    if (fakultasId) {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          room_id,
          buildings!inner (
            fakultas_id
          )
        `)
        .eq('buildings.fakultas_id', fakultasId);

      if (error) return 0;
      return data?.length ?? 0;
    } else {
      const { count } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    }
  } catch {
    return 0;
  }
};

// ===================== UPDATE =====================

export const updatePeminjamanStatus = async (
  id: number,
  status: PeminjamanStatus,
  alasanPenolakan?: string,
  approvedBy?: string
): Promise<Peminjaman> => {
  const updateData: Record<string, unknown> = { status };
  
  if (status === 'ditolak' && alasanPenolakan) {
    updateData.alasan_penolakan = alasanPenolakan;
  }
  
  if (approvedBy) {
    updateData.approved_by = approvedBy;
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

// Cancel peminjaman (only if status is 'menunggu')
export const cancelPeminjaman = async (id: number, userId: string): Promise<void> => {
  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('peminjaman')
    .select('user_id, status')
    .eq('peminjaman_id', id)
    .single();

  if (fetchError || !existing) {
    throw new Error('Peminjaman tidak ditemukan.');
  }

  if (existing.user_id !== userId) {
    throw new Error('Anda tidak berhak membatalkan peminjaman ini.');
  }

  if (existing.status !== 'menunggu') {
    throw new Error('Hanya peminjaman dengan status menunggu yang bisa dibatalkan.');
  }

  const { error } = await supabase
    .from('peminjaman')
    .update({ status: 'dibatalkan' })
    .eq('peminjaman_id', id);

  if (error) {
    console.error('Error cancelling peminjaman:', error);
    throw new Error(error.message);
  }
};