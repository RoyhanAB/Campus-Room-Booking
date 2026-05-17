export type PeminjamanStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';

export interface Peminjaman {
  peminjaman_id: number;
  room_id: string;
  user_id: string;
  nama_kegiatan: string;
  tanggal_dimulai: string; 
  tanggal_selesai: string;
  deskripsi: string;
  jumlah_peserta: number;
  dokumen: string;
  status: string;
  alasan_penolakan?: string | null;
  created_at : string;
  // Joined fields (optional, dari relasi)
  user_name?: string;
  room_kapasitas?: number;
  approved_by?: string | null;
}

export interface PeminjamanInput {
  room_id: string;
  user_id: string;
  nama_kegiatan: string;
  tanggal_dimulai: string;
  tanggal_selesai: string;
  deskripsi: string;
  jumlah_peserta: number;
  dokumen?: string;
  status?: PeminjamanStatus;
}