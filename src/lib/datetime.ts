export const APP_TIME_ZONE = 'Asia/Jakarta';

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const SHORT_MONTHS_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const WEEKDAYS_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const pad = (value: number) => value.toString().padStart(2, '0');

function toJakartaParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00';

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
}

function hasTimezoneOffset(value: string) {
  return /(Z|[+-]\d{2}:?\d{2})$/i.test(value.trim());
}

function partsToLocalString(parts: DateParts) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:00`;
}

export function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function normalizeDateTimeLocal(value: string) {
  if (hasTimezoneOffset(value)) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Format tanggal tidak valid.');
    }
    return partsToLocalString(toJakartaParts(date));
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);
  if (!match) {
    throw new Error('Format tanggal tidak valid.');
  }

  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00`;
}

export function toDatetimeLocalInput(value: string) {
  return normalizeDateTimeLocal(value).slice(0, 16);
}

function parseLocalDateTime(value: string): DateParts {
  const normalized = normalizeDateTimeLocal(value);
  return {
    year: Number(normalized.slice(0, 4)),
    month: Number(normalized.slice(5, 7)),
    day: Number(normalized.slice(8, 10)),
    hour: Number(normalized.slice(11, 13)),
    minute: Number(normalized.slice(14, 16)),
  };
}

export function compareLocalDateTime(a: string, b: string) {
  return normalizeDateTimeLocal(a).localeCompare(normalizeDateTimeLocal(b));
}

export function minutesOfDay(value: string) {
  const parts = parseLocalDateTime(value);
  return parts.hour * 60 + parts.minute;
}

export function diffMinutes(start: string, end: string) {
  const a = parseLocalDateTime(start);
  const b = parseLocalDateTime(end);
  const startMs = Date.UTC(a.year, a.month - 1, a.day, a.hour, a.minute);
  const endMs = Date.UTC(b.year, b.month - 1, b.day, b.hour, b.minute);
  return Math.round((endMs - startMs) / 60000);
}

export function isSameLocalDate(a: string, b: string) {
  return normalizeDateTimeLocal(a).slice(0, 10) === normalizeDateTimeLocal(b).slice(0, 10);
}

export function nowInJakartaLocal() {
  return partsToLocalString(toJakartaParts(new Date()));
}

export function getWeekRangeLocal(value: string) {
  const parts = parseLocalDateTime(value);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const day = date.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diffToMonday);
  const start = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T00:00:00`;
  date.setUTCDate(date.getUTCDate() + 7);
  const end = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T00:00:00`;
  return { start, end };
}

export function formatLocalDate(value: string, short = false) {
  const parts = parseLocalDateTime(value);
  const month = short ? SHORT_MONTHS_ID[parts.month - 1] : MONTHS_ID[parts.month - 1];
  return `${parts.day} ${month} ${parts.year}`;
}

export function formatLocalTime(value: string) {
  const parts = parseLocalDateTime(value);
  return `${pad(parts.hour)}.${pad(parts.minute)}`;
}

export function formatLocalDateTime(value: string) {
  return `${formatLocalDate(value)} ${formatLocalTime(value)}`;
}

export function formatLocalDateWithWeekday(value: string) {
  const parts = parseLocalDateTime(value);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  return `${WEEKDAYS_ID[date.getUTCDay()]}, ${formatLocalDate(value)}`;
}
