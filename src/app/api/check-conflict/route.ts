import { NextRequest, NextResponse } from 'next/server';
import { checkScheduleConflict } from '@/lib/schedule';
import { normalizeDateTimeLocal } from '@/lib/datetime';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const roomId = searchParams.get('room_id');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!roomId || !start || !end) {
    return NextResponse.json({ hasConflict: false, names: '' });
  }

  let normalizedStart: string;
  let normalizedEnd: string;
  try {
    normalizedStart = normalizeDateTimeLocal(start);
    normalizedEnd = normalizeDateTimeLocal(end);
  } catch {
    return NextResponse.json({ hasConflict: false, names: '' }, { status: 400 });
  }

  const { hasConflict, conflictingSchedules } = await checkScheduleConflict(roomId, normalizedStart, normalizedEnd);

  return NextResponse.json({
    hasConflict,
    names: conflictingSchedules.map(s => s.schedule_name).join(', '),
    count: conflictingSchedules.length,
  });
}
