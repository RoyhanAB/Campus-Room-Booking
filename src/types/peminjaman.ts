export type PeminjamanStatus = 'menunggu' | 'disetujui' | 'ditolak';

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
  created_at : string;
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