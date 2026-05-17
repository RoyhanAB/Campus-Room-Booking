'use server';

import { createBuilding, updateBuilding, deleteBuilding } from '@/lib/building';
import { createFakultas, updateFakultas, deleteFakultas } from '@/lib/fakultas';
import { createUser, updateUser, deleteUser, assignAdminToFakultas, removeAdminFromFakultas } from '@/lib/user';
import { getSession, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

// Helper: cek apakah caller adalah super_admin
async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    throw new Error('Unauthorized: Hanya super admin yang bisa melakukan aksi ini.');
  }
  return session;
}

// ===================== BUILDING ACTIONS =====================

export async function createBuildingAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const buildingName = formData.get('building_name') as string;
  const fakultasId = Number(formData.get('fakultas_id'));
  const floor = Number(formData.get('floor'));

  if (!buildingName || !fakultasId || !floor) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  try {
    await createBuilding({ building_name: buildingName.trim(), fakultas_id: fakultasId, floor });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membuat gedung.', success: false };
  }

  revalidatePath('/admin/kelola-gedung');
  return { error: '', success: true };
}

export async function updateBuildingAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const buildingId = Number(formData.get('building_id'));
  const buildingName = formData.get('building_name') as string;
  const fakultasId = Number(formData.get('fakultas_id'));
  const floor = Number(formData.get('floor'));

  if (!buildingId || !buildingName || !fakultasId || !floor) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  try {
    await updateBuilding(buildingId, { building_name: buildingName.trim(), fakultas_id: fakultasId, floor });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengupdate gedung.', success: false };
  }

  revalidatePath('/admin/kelola-gedung');
  return { error: '', success: true };
}

export async function deleteBuildingAction(buildingId: number) {
  await requireSuperAdmin();
  await deleteBuilding(buildingId);
  revalidatePath('/admin/kelola-gedung');
}

// ===================== FAKULTAS ACTIONS =====================

export async function createFakultasAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const fakultasName = formData.get('fakultas_name') as string;
  const lokasi = formData.get('lokasi') as string;

  if (!fakultasName) {
    return { error: 'Nama fakultas wajib diisi.', success: false };
  }

  try {
    await createFakultas({ fakultas_name: fakultasName.trim(), lokasi: lokasi?.trim() || '' });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membuat fakultas.', success: false };
  }

  revalidatePath('/admin/kelola-fakultas');
  return { error: '', success: true };
}

export async function updateFakultasAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const fakultasId = Number(formData.get('fakultas_id'));
  const fakultasName = formData.get('fakultas_name') as string;
  const lokasi = formData.get('lokasi') as string;

  if (!fakultasId || !fakultasName) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  try {
    await updateFakultas(fakultasId, { fakultas_name: fakultasName.trim(), lokasi: lokasi?.trim() || '' });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengupdate fakultas.', success: false };
  }

  revalidatePath('/admin/kelola-fakultas');
  return { error: '', success: true };
}

export async function deleteFakultasAction(fakultasId: number) {
  await requireSuperAdmin();
  await deleteFakultas(fakultasId);
  revalidatePath('/admin/kelola-fakultas');
}

// ===================== ADMIN USER ACTIONS =====================

export async function createAdminAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const userId = formData.get('user_id') as string;
  const password = formData.get('password') as string;
  const userName = formData.get('user_name') as string;
  const fakultasId = Number(formData.get('fakultas_id'));

  if (!userId || !password || !userName || !fakultasId) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.', success: false };
  }

  try {
    const hashedPassword = await hashPassword(password);

    await createUser({
      user_id: userId.trim(),
      password: hashedPassword,
      user_name: userName.trim(),
      role: 'admin_fakultas',
    });

    await supabaseAdmin
      .from('profiles')
      .insert({ user_id: userId.trim(), jurusan: 'Administrator', angkatan: new Date().getFullYear().toString() });

    await assignAdminToFakultas(userId.trim(), fakultasId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membuat admin.', success: false };
  }

  revalidatePath('/admin/kelola-admin');
  return { error: '', success: true };
}

export async function reassignAdminFakultasAction(userId: string, fakultasId: number) {
  await requireSuperAdmin();
  await assignAdminToFakultas(userId, fakultasId);
  revalidatePath('/admin/kelola-admin');
}

export async function deleteAdminAction(userId: string) {
  await requireSuperAdmin();
  await removeAdminFromFakultas(userId);
  await deleteUser(userId);
  revalidatePath('/admin/kelola-admin');
}

// ===================== ALL USER ACTIONS (Super Admin) =====================

export async function createUserAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const userId = formData.get('user_id') as string;
  const password = formData.get('password') as string;
  const userName = formData.get('user_name') as string;
  const role = formData.get('role') as string;

  if (!userId || !password || !userName || !role) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.', success: false };
  }

  try {
    const hashedPassword = await hashPassword(password);
    
    await createUser({
      user_id: userId.trim(),
      password: hashedPassword,
      user_name: userName.trim(),
      role,
    });

    // Create profile
    const jurusan = formData.get('jurusan') as string;
    const angkatan = formData.get('angkatan') as string;
    await supabaseAdmin
      .from('profiles')
      .insert({ 
        user_id: userId.trim(), 
        jurusan: jurusan?.trim() || '', 
        angkatan: angkatan?.trim() || '' 
      });

    // If admin_fakultas, assign to fakultas
    if (role === 'admin_fakultas') {
      const fakultasId = Number(formData.get('fakultas_id'));
      if (fakultasId) {
        await assignAdminToFakultas(userId.trim(), fakultasId);
      }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membuat user.', success: false };
  }

  revalidatePath('/admin/kelola-user');
  return { error: '', success: true };
}

export async function updateUserAction(
  _prev: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  await requireSuperAdmin();

  const userId = formData.get('user_id') as string;
  const userName = formData.get('user_name') as string;
  const role = formData.get('role') as string;

  if (!userId || !userName || !role) {
    return { error: 'Semua field wajib diisi.', success: false };
  }

  try {
    await supabaseAdmin
      .from('users')
      .update({ user_name: userName.trim(), role })
      .eq('user_id', userId);

    // Update profile
    const jurusan = formData.get('jurusan') as string;
    const angkatan = formData.get('angkatan') as string;
    if (jurusan || angkatan) {
      await supabaseAdmin
        .from('profiles')
        .upsert({ 
          user_id: userId,
          jurusan: jurusan?.trim() || '', 
          angkatan: angkatan?.trim() || '' 
        });
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengupdate user.', success: false };
  }

  revalidatePath('/admin/kelola-user');
  return { error: '', success: true };
}

export async function resetPasswordAction(userId: string, newPassword: string) {
  await requireSuperAdmin();

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }

  const hashedPassword = await hashPassword(newPassword);
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({ password: hashedPassword })
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/kelola-user');
}

export async function deleteUserAction(userId: string) {
  await requireSuperAdmin();
  await deleteUser(userId);
  revalidatePath('/admin/kelola-user');
}
