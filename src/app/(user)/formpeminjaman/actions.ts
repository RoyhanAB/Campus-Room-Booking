'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { detailroom } from '@/lib/ruangan';
import { createPeminjaman } from '@/lib/peminjaman';
import { checkScheduleConflict } from '@/lib/schedule';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  compareLocalDateTime,
  diffMinutes,
  getWeekRangeLocal,
  isSameLocalDate,
  minutesOfDay,
  normalizeDateTimeLocal,
  nowInJakartaLocal,
} from '@/lib/datetime';
import { getSettingObject, getSystemSettings } from '@/lib/settings';

type SubmitPeminjamanPayload = {
  room_id: string;
  nama_kegiatan: string;
  tanggal_dimulai: string;
  tanggal_selesai: string;
  deskripsi: string;
  jumlah_peserta: number;
  dokumen?: string;
};

export async function submitPeminjamanAction(
  payload: SubmitPeminjamanPayload
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role === 'admin_fakultas' || session.role === 'super_admin') {
    return { success: false, error: 'Silakan login sebagai peminjam.' };
  }

  const roomId = payload.room_id.trim().toUpperCase();
  const namaKegiatan = payload.nama_kegiatan.trim();
  const deskripsi = payload.deskripsi.trim();
  const peserta = Number(payload.jumlah_peserta);

  if (!roomId || !namaKegiatan || !deskripsi) {
    return { success: false, error: 'Semua field wajib harus diisi.' };
  }

  if (!Number.isInteger(peserta) || peserta < 1) {
    return { success: false, error: 'Jumlah peserta minimal 1 orang.' };
  }

  let start: string;
  let end: string;
  try {
    start = normalizeDateTimeLocal(payload.tanggal_dimulai);
    end = normalizeDateTimeLocal(payload.tanggal_selesai);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Format tanggal tidak valid.' };
  }

  if (compareLocalDateTime(end, start) <= 0) {
    return { success: false, error: 'Tanggal selesai harus lebih besar dari tanggal mulai.' };
  }

  if (compareLocalDateTime(start, nowInJakartaLocal()) < 0) {
    return { success: false, error: 'Tidak dapat membuat booking untuk waktu yang sudah lewat.' };
  }

  if (!isSameLocalDate(start, end)) {
    return { success: false, error: 'Peminjaman harus selesai di hari yang sama.' };
  }

  const [room, settings] = await Promise.all([
    detailroom(roomId),
    getSystemSettings(),
  ]);

  if (peserta > room.kapasitas) {
    return {
      success: false,
      error: `Jumlah peserta (${peserta}) melebihi kapasitas ruangan (${room.kapasitas} orang).`,
    };
  }

  const maintenance = getSettingObject(settings, 'maintenance_mode', { active: false, message: '' });
  if (Boolean(maintenance.active)) {
    return {
      success: false,
      error: typeof maintenance.message === 'string' && maintenance.message
        ? maintenance.message
        : 'Sistem sedang dalam mode maintenance.',
    };
  }

  const jamOperasional = getSettingObject(settings, 'jam_operasional', { buka: '07:00', tutup: '21:00' });
  const jamBuka = String(jamOperasional.buka || '07:00');
  const jamTutup = String(jamOperasional.tutup || '21:00');
  const buka = minutesOfDay(`2000-01-01T${jamBuka}:00`);
  const tutup = minutesOfDay(`2000-01-01T${jamTutup}:00`);
  const startMinute = minutesOfDay(start);
  const endMinute = minutesOfDay(end);

  if (startMinute < buka || endMinute > tutup) {
    return {
      success: false,
      error: `Peminjaman hanya boleh pada jam operasional ${jamBuka}-${jamTutup} WIB.`,
    };
  }

  const maxDurasi = getSettingObject(settings, 'max_durasi_booking', { jam: 8 });
  const maxDurasiJam = Number(maxDurasi.jam || 8);
  const durationMinutes = diffMinutes(start, end);
  if (durationMinutes > maxDurasiJam * 60) {
    return { success: false, error: `Durasi peminjaman maksimal ${maxDurasiJam} jam.` };
  }

  const maxPerMinggu = getSettingObject(settings, 'max_booking_per_minggu', { limit: 5 });
  const maxBookingMingguan = Number(maxPerMinggu.limit || 5);
  const week = getWeekRangeLocal(start);
  const { count } = await supabaseAdmin
    .from('peminjaman')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user_id)
    .in('status', ['menunggu', 'disetujui'])
    .gte('tanggal_dimulai', week.start)
    .lt('tanggal_dimulai', week.end);

  if ((count ?? 0) >= maxBookingMingguan) {
    return { success: false, error: `Maksimal ${maxBookingMingguan} booking per minggu.` };
  }

  const { hasConflict, conflictingSchedules } = await checkScheduleConflict(roomId, start, end);
  if (hasConflict) {
    return {
      success: false,
      error: `Jadwal bentrok dengan: ${conflictingSchedules.map((s) => s.schedule_name).join(', ')}.`,
    };
  }

  await createPeminjaman({
    room_id: roomId,
    user_id: session.user_id,
    nama_kegiatan: namaKegiatan,
    tanggal_dimulai: start,
    tanggal_selesai: end,
    deskripsi,
    jumlah_peserta: peserta,
    dokumen: payload.dokumen?.trim() || '',
  });

  revalidatePath('/history');
  revalidatePath('/admin/listpeminjaman');
  return { success: true };
}
