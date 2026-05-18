import { createHmac, timingSafeEqual } from 'node:crypto';
import type { SessionData } from './auth';

const getSecret = () =>
  process.env.SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'development-session-secret';

const base64url = (value: string) =>
  Buffer.from(value, 'utf8').toString('base64url');

const unbase64url = (value: string) =>
  Buffer.from(value, 'base64url').toString('utf8');

const sign = (payload: string) =>
  createHmac('sha256', getSecret()).update(payload).digest('base64url');

export function serializeSession(session: SessionData) {
  const payload = base64url(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function parseSessionCookie(value: string): SessionData | null {
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(unbase64url(payload)) as SessionData;
  } catch {
    return null;
  }
}
