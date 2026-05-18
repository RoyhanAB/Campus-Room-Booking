'use server';

import { updatePeminjamanStatus, getPeminjamanById } from '@/lib/peminjaman';
import { createRoom, updateRoom, deleteRoomById, getAllBuildings, detailroom } from '@/lib/ruangan';
import { createScheduleFromPeminjaman, checkScheduleConflict, deleteScheduleByDetails } from '@/lib/schedule';
import { PeminjamanStatus } from '@/types/peminjaman';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper: cek apakah caller adalah admin
async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== 'admin_fakultas' && session.role !== 'super_admin')) {
    throw new Error('Unauthorized: Anda tidak memiliki akses.');
  }
  return session;
}

async function requireRoomAccess(roomId: string, userId: string, role: string) {
  if (role === 'super_admin') return;

  const [adminInfo, buildings] = await Promise.all([
    getAdminInfo(userId),
    getAllBuildings(),
  ]);
  const room = await detailroom(roomId);
  const building = buildings.find((item) => item.building_id === room.building_id);

  if (!adminInfo?.fakultas_id || building?.fakultas_id !== adminInfo.fakultas_id) {
    throw new Error('Unauthorized: Ruangan bukan dalam fakultas Anda.');
  }
}

async function requireBuildingAccess(buildingId: number, userId: string, role: string) {
  if (role === 'super_admin') return;

  const [adminInfo, buildings] = await Promise.all([
    getAdminInfo(userId),
    getAllBuildings(),
  ]);
  const building = buildings.find((item) => item.building_id === buildingId);

  if (!adminInfo?.fakultas_id || building?.fakultas_id !== adminInfo.fakultas_id) {
    throw new Error('Unauthorized: Gedung bukan dalam fakultas Anda.');
  }
}

// ===================== PEMINJAMAN ACTIONS =====================

export async function approvePeminjamanAction(id: number): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdmin();
  
  const peminjaman = await getPeminjamanById(id);
  
  if (!peminjaman) {
    return { success: false, error: 'Peminjaman tidak ditemukan.' };
  }

  await requireRoomAccess(peminjaman.room_id, session.user_id, session.role);

  // Cek jadwal conflict sebelum approve
  const { hasConflict, conflictingSchedules } = await checkScheduleConflict(
    peminjaman.room_id,
    peminjaman.tanggal_dimulai,
    peminjaman.tanggal_selesai
  );

  if (hasConflict) {
    const conflictNames = conflictingSchedules
      .map(s => s.schedule_name)
      .join(', ');
    return {
      success: false,
      error: `Jadwal bentrok dengan: ${conflictNames}. Tolak jadwal yang bentrok terlebih dahulu sebelum menyetujui.`,
    };
  }

  // Update status peminjaman + set approved_by
  await updatePeminjamanStatus(id, 'disetujui' as PeminjamanStatus, undefined, session.user_id);
  
  try {
    await createScheduleFromPeminjaman(
      peminjaman.room_id,
      peminjaman.user_id,
      peminjaman.nama_kegiatan,
      peminjaman.tanggal_dimulai,
      peminjaman.tanggal_selesai
    );
  } catch (error) {
    console.error('Failed to create schedule:', error);
  }
  
  revalidatePath('/admin/listpeminjaman');
  return { success: true };
}

export async function rejectPeminjamanAction(id: number, alasanPenolakan?: string) {
  const session = await requireAdmin();
  
  // Ambil data peminjaman untuk hapus schedule jika ada
  const peminjaman = await getPeminjamanById(id);

  if (peminjaman) {
    await requireRoomAccess(peminjaman.room_id, session.user_id, session.role);
  }
  
  await updatePeminjamanStatus(id, 'ditolak' as PeminjamanStatus, alasanPenolakan, session.user_id);
  
  // Hapus schedule terkait jika sudah pernah di-approve
  if (peminjaman) {
    try {
      await deleteScheduleByDetails(
        peminjaman.room_id,
        peminjaman.tanggal_dimulai,
        peminjaman.tanggal_selesai
      );
    } catch {
      // Tidak apa-apa jika schedule tidak ditemukan
    }
  }
  
  revalidatePath('/admin/listpeminjaman');
}

// ===================== ROOM ACTIONS =====================

export async function createRoomAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const session = await requireAdmin();
  
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

  await requireBuildingAccess(buildingId, session.user_id, session.role);

  try {
    const buildings = await getAllBuildings();
    const building = buildings.find(b => b.building_id === buildingId);
    if (building && floor > building.floor) {
      return { 
        error: `Lantai tidak boleh lebih dari ${building.floor} (jumlah lantai ${building.building_name}).`, 
        success: false 
      };
    }
  } catch {
    // Lanjutkan tanpa validasi jika gagal fetch buildings
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
  const session = await requireAdmin();
  
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

  await requireRoomAccess(roomId, session.user_id, session.role);
  await requireBuildingAccess(buildingId, session.user_id, session.role);

  try {
    const buildings = await getAllBuildings();
    const building = buildings.find(b => b.building_id === buildingId);
    if (building && floor > building.floor) {
      return { 
        error: `Lantai tidak boleh lebih dari ${building.floor} (jumlah lantai ${building.building_name}).`, 
        success: false 
      };
    }
  } catch {
    // Lanjutkan tanpa validasi jika gagal fetch buildings
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
  const session = await requireAdmin();
  await requireRoomAccess(roomId, session.user_id, session.role);
  await deleteRoomById(roomId);
  revalidatePath('/admin/listruangan');
  redirect('/admin/listruangan');
}
