import { cookies } from 'next/headers';
import { supabase } from './supabase';
import { User } from '../types/user';
import bcrypt from 'bcryptjs';
import { parseSessionCookie, serializeSession } from './session-cookie';

export interface SessionData {
  user_id: string;
  user_name: string;
  role: string;
}

const SESSION_COOKIE_NAME = 'session';

/**
 * Login user — validasi credentials dari tabel users
 * Supports both bcrypt-hashed and plain-text passwords (migration period)
 */
export async function login(userId: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { success: false, error: 'User ID tidak ditemukan.' };
  }

  // Support both hashed and plain-text passwords (for migration)
  let passwordValid = false;
  if (data.password.startsWith('$2a$') || data.password.startsWith('$2b$')) {
    // Bcrypt hashed password
    passwordValid = await bcrypt.compare(password, data.password);
  } else {
    // Plain text (legacy) — compare directly
    passwordValid = data.password === password;
  }

  if (!passwordValid) {
    return { success: false, error: 'Password salah.' };
  }

  // Set session cookie
  const session: SessionData = {
    user_id: data.user_id,
    user_name: data.user_name,
    role: data.role,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, serializeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  });

  return { success: true, user: data as User };
}

/**
 * Logout — hapus session cookie
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Ambil session dari cookie (server-side)
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const parsed = parseSessionCookie(sessionCookie.value);
    if (!parsed) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('user_id, user_name, role')
      .eq('user_id', parsed.user_id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      user_id: data.user_id,
      user_name: data.user_name,
      role: data.role,
    };
  } catch {
    return null;
  }
}

/**
 * Ambil data user lengkap berdasarkan session
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', session.user_id)
    .single();

  if (error || !data) return null;
  return data as User;
}

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
