import { Suspense } from 'react';
import styles from './listruangan.module.css';
import { getRoomsLimit15, getAllBuildings } from '@/lib/ruangan';
import { getAllFakultas } from '@/lib/fakultas';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import ListRuanganClient from '../../ListRuanganClient';
import LoadingSkeleton from './loading';

export const revalidate = 0; 

async function RuanganData() {
  const [rooms, buildings, fakultas, session] = await Promise.all([
    getRoomsLimit15(),
    getAllBuildings(),
    getAllFakultas(),
    getSession(),
  ]);

  let visibleBuildings = buildings;
  let visibleRooms = rooms;

  if (session?.role === 'admin_fakultas') {
    const adminInfo = await getAdminInfo(session.user_id);
    visibleBuildings = buildings.filter((building) => building.fakultas_id === adminInfo?.fakultas_id);
    const visibleBuildingIds = new Set(visibleBuildings.map((building) => building.building_id));
    visibleRooms = rooms.filter((room) => visibleBuildingIds.has(room.building_id));
  }
  
  return (
    <ListRuanganClient 
      rooms={visibleRooms} 
      buildings={visibleBuildings}
      fakultas={fakultas}
      basePath="/admin/listruangan" 
      styles={styles}
    />
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RuanganData />
    </Suspense>
  );
}
