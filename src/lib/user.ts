import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import { User } from '../types/user';

// ===================== READ =====================

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('user_id', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  return data as User[];
};

// Get all users with profile info
export interface UserWithProfile extends User {
  jurusan?: string;
  angkatan?: string;
  fakultas_name?: string;
}

type ProfileRow = {
  user_id: string;
  jurusan?: string | null;
  angkatan?: string | null;
};

type AdminAssignmentRow = {
  user_id: string;
  fakultas_id?: number | null;
  fakultas?: { fakultas_name?: string | null } | null;
};

export const getAllUsersWithProfiles = async (): Promise<UserWithProfile[]> => {
  // Fetch users
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('user_id', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  // Fetch profiles separately (avoids FK join issues)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, jurusan, angkatan');

  const profileMap = new Map<string, { jurusan: string; angkatan: string }>();
  ((profiles ?? []) as ProfileRow[]).forEach((p) => {
    profileMap.set(p.user_id, { jurusan: p.jurusan || '', angkatan: p.angkatan || '' });
  });

  // Fetch admin_fakultas assignments for faculty name
  const { data: assignments } = await supabase
    .from('admin_fakultas')
    .select(`
      user_id,
      fakultas:fakultas_id (fakultas_name)
    `);

  const fakultasMap = new Map<string, string>();
  ((assignments ?? []) as AdminAssignmentRow[]).forEach((a) => {
    fakultasMap.set(a.user_id, a.fakultas?.fakultas_name || '');
  });

  return (users as User[]).map(u => {
    const profile = profileMap.get(u.user_id);
    return {
      user_id: u.user_id,
      password: u.password,
      user_name: u.user_name,
      role: u.role,
      jurusan: profile?.jurusan || '',
      angkatan: profile?.angkatan || '',
      fakultas_name: fakultasMap.get(u.user_id) || '',
    };
  });
};

export const getAdminUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'admin_fakultas')
    .order('user_id', { ascending: true });

  if (error) {
    console.error('Error fetching admin users:', error);
    throw new Error(error.message);
  }

  return data as User[];
};

// Get admins with their assigned fakultas
export interface AdminWithFakultas extends User {
  fakultas_id?: number;
  fakultas_name?: string;
}

export const getAdminsWithFakultas = async (): Promise<AdminWithFakultas[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'admin_fakultas')
    .order('user_id', { ascending: true });

  if (error) {
    console.error('Error fetching admin users:', error);
    throw new Error(error.message);
  }

  // Fetch admin_fakultas assignments
  const { data: assignments, error: assignError } = await supabase
    .from('admin_fakultas')
    .select(`
      user_id,
      fakultas_id,
      fakultas:fakultas_id (fakultas_name)
    `);

  if (assignError) {
    console.error('Error fetching admin assignments:', assignError);
  }

  const assignmentMap = new Map<string, { fakultas_id: number; fakultas_name: string }>();
  ((assignments ?? []) as AdminAssignmentRow[]).forEach((a) => {
    if (typeof a.fakultas_id !== 'number') return;
    assignmentMap.set(a.user_id, {
      fakultas_id: a.fakultas_id,
      fakultas_name: a.fakultas?.fakultas_name || '',
    });
  });

  return (data as User[]).map(user => {
    const assignment = assignmentMap.get(user.user_id);
    return {
      ...user,
      fakultas_id: assignment?.fakultas_id,
      fakultas_name: assignment?.fakultas_name,
    };
  });
};

// ===================== CREATE =====================

export const createUser = async (payload: {
  user_id: string;
  password: string;
  user_name: string;
  role: string;
}): Promise<User> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }

  return data as User;
};

// ===================== UPDATE =====================

export const updateUser = async (
  userId: string,
  payload: Partial<Omit<User, 'user_id'>>
): Promise<User> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(payload)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw new Error(error.message);
  }

  return data as User;
};

// ===================== ADMIN FAKULTAS ASSIGNMENT =====================

export const assignAdminToFakultas = async (userId: string, fakultasId: number): Promise<void> => {
  // Upsert: insert or update
  const { error } = await supabaseAdmin
    .from('admin_fakultas')
    .upsert({ user_id: userId, fakultas_id: fakultasId }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error assigning admin to fakultas:', error);
    throw new Error(error.message);
  }
};

export const removeAdminFromFakultas = async (userId: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('admin_fakultas')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing admin from fakultas:', error);
    throw new Error(error.message);
  }
};

// ===================== DELETE =====================

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.message);
  }
};
