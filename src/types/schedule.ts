export interface Schedule {
    schedule_id: number;
    room_id: string;
    user_id: string;
    schedule_name: string;
    tanggal_dimulai: string; // Menggunakan string untuk format ISO datetime dari Supabase
    tanggal_selesai: string;
}