import { supabaseAdmin } from './supabaseAdmin';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type SystemSettings = Record<string, JsonValue>;

export async function getSystemSettings(): Promise<SystemSettings> {
  const { data, error } = await supabaseAdmin
    .from('system_settings')
    .select('key, value');

  if (error) return {};

  return (data ?? []).reduce<SystemSettings>((acc, row: { key: string; value: JsonValue }) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export function getSettingObject<T extends Record<string, JsonValue>>(
  settings: SystemSettings,
  key: string,
  fallback: T
) {
  const value = settings[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? ({ ...fallback, ...value } as T)
    : fallback;
}
