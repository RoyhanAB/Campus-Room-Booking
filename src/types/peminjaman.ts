export interface Peminjaman {
  peminjaman_id: number;
  room_id: string;
  user_id: string;
  nama_kegiatan: string;
  tanggal_dimulai: string; // Menggunakan string untuk format ISO datetime dari Supabase
  tanggal_selesai: string;
  dekripsi: string;
  jumlah_peserta: number;
  dokumen: string;
  status: string;
  created_at : string;
}