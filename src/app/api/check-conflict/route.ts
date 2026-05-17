import { NextRequest, NextResponse } from 'next/server';
import { checkScheduleConflict } from '@/lib/schedule';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const roomId = searchParams.get('room_id');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!roomId || !start || !end) {
    return NextResponse.json({ hasConflict: false, names: '' });
  }

  const { hasConflict, conflictingSchedules } = await checkScheduleConflict(roomId, start, end);

  return NextResponse.json({
    hasConflict,
    names: conflictingSchedules.map(s => s.schedule_name).join(', '),
    count: conflictingSchedules.length,
  });
}
