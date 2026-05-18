import { FormPeminjamanClient } from './form-peminjaman-client';
import { getSession } from '@/lib/auth';
import { detailroom } from '@/lib/ruangan';
import { getAllBuildings } from '@/lib/ruangan';
import { redirect } from 'next/navigation';
import { getSettingObject, getSystemSettings } from '@/lib/settings';

type SearchParams = Promise<{ roomId?: string | string[] }>;

export const revalidate = 0;

export default async function FormPeminjamanPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const roomParam = resolvedSearchParams.roomId;
  const defaultRoomId = typeof roomParam === 'string' ? roomParam : '';

  if (!defaultRoomId) {
    redirect('/listruangan');
  }

  const session = await getSession();

  const [room, buildings, settings] = await Promise.all([
    detailroom(defaultRoomId),
    getAllBuildings(),
    getSystemSettings(),
  ]);

  const building = buildings.find(b => b.building_id === room.building_id);
  const maxDurasi = getSettingObject(settings, 'max_durasi_booking', { jam: 8 });

  return (
    <FormPeminjamanClient
      defaultRoomId={defaultRoomId}
      userId={session?.user_id || ''}
      userName={session?.user_name || ''}
      room={room}
      buildingName={building?.building_name || ''}
      maxBookingHours={Number(maxDurasi.jam || 8)}
    />
  );
}
