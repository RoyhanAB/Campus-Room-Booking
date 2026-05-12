'use server';

import { updatePeminjamanStatus, getPeminjamanById } from '@/lib/peminjaman';
import { createRoom, updateRoom, deleteRoomById } from '@/lib/ruangan';
import { createScheduleFromPeminjaman } from '@/lib/schedule';
import { PeminjamanStatus } from '@/types/peminjaman';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ===================== PEMINJAMAN ACTIONS =====================

export async function approvePeminjamanAction(id: number) {
  // Update status peminjaman
  await updatePeminjamanStatus(id, 'disetujui' as PeminjamanStatus);
  
  // Ambil data peminjaman untuk membuat schedule
  const peminjaman = await getPeminjamanById(id);
  
  if (peminjaman) {
    try {
      // Auto create schedule
      await createScheduleFromPeminjaman(
        peminjaman.room_id,
        peminjaman.user_id,
        peminjaman.nama_kegiatan,
        peminjaman.tanggal_dimulai,
        peminjaman.tanggal_selesai
      );
      console.log(`Schedule created for peminjaman #${id}`);
    } catch (error) {
      console.error('Failed to create schedule:', error);
      // Tidak throw error agar approval tetap berhasil meski schedule gagal
    }
  }
  
  revalidatePath('/admin/listpeminjaman');
}

export async function rejectPeminjamanAction(id: number, alasanPenolakan?: string) {
  await updatePeminjamanStatus(id, 'ditolak' as PeminjamanStatus, alasanPenolakan);
  revalidatePath('/admin/listpeminjaman');
}

// ===================== ROOM ACTIONS =====================

export async function createRoomAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const roomId = formData.get('room_id') as string;
  const buildingId = Number(formData.get('building_id'));
  const floor = Number(formData.get('floor'));
  const number = Number(formData.get('number'));
  const kapasitas = Number(formData.get('kapasitas'));
  const deskripsi = formData.get('deskripsi') as string;
  const foto = formData.get('foto') as string;

  if (!roomId || !buildingId || !floor || !kapasitas) {
    return { error: 'Semua field wajib harus diisi.', success: false };
  }

  try {
    await createRoom({
      room_id: roomId.trim().toUpperCase(),
      building_id: buildingId,
      floor,
      number: number || 0,
      kapasitas,
      deskripsi: deskripsi?.trim() || '',
      foto: foto || '',
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal menambahkan ruangan.', success: false };
  }

  revalidatePath('/admin/listruangan');
  redirect('/admin/listruangan');
}

export async function updateRoomAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const roomId = formData.get('room_id') as string;
  const buildingId = Number(formData.get('building_id'));
  const floor = Number(formData.get('floor'));
  const number = Number(formData.get('number'));
  const kapasitas = Number(formData.get('kapasitas'));
  const deskripsi = formData.get('deskripsi') as string;
  const foto = formData.get('foto') as string;

  if (!roomId || !buildingId || !kapasitas) {
    return { error: 'Semua field wajib harus diisi.', success: false };
  }

  try {
    await updateRoom(roomId, {
      building_id: buildingId,
      floor,
      number: number || 0,
      kapasitas,
      deskripsi: deskripsi?.trim() || '',
      foto: foto || '',
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengupdate ruangan.', success: false };
  }

  revalidatePath('/admin/listruangan');
  redirect(`/admin/listruangan/${roomId}`);
}

export async function deleteRoomAction(roomId: string) {
  await deleteRoomById(roomId);
  revalidatePath('/admin/listruangan');
  redirect('/admin/listruangan');
}
