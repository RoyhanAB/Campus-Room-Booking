import { detailroom, getAllBuildings } from '@/lib/ruangan';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { redirect } from 'next/navigation';
import EditRuanganForm from './EditRuanganForm';

export const revalidate = 0;

export default async function EditRuanganPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const [room, buildings, session] = await Promise.all([
    detailroom(roomId),
    getAllBuildings(),
    getSession(),
  ]);

  let visibleBuildings = buildings;
  const currentBuilding = buildings.find((building) => building.building_id === room.building_id);

  if (session?.role === 'admin_fakultas') {
    const adminInfo = await getAdminInfo(session.user_id);
    if (!adminInfo?.fakultas_id || currentBuilding?.fakultas_id !== adminInfo.fakultas_id) {
      redirect('/admin/listruangan');
    }
    visibleBuildings = buildings.filter((building) => building.fakultas_id === adminInfo.fakultas_id);
  }

  return <EditRuanganForm room={room} buildings={visibleBuildings} />;
}
