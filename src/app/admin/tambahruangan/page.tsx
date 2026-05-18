import { getAllBuildings } from '@/lib/ruangan';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import TambahRuanganForm from './TambahRuanganForm';

export const revalidate = 0;

export default async function TambahRuanganPage() {
  const [buildings, session] = await Promise.all([getAllBuildings(), getSession()]);
  let visibleBuildings = buildings;

  if (session?.role === 'admin_fakultas') {
    const adminInfo = await getAdminInfo(session.user_id);
    visibleBuildings = buildings.filter((building) => building.fakultas_id === adminInfo?.fakultas_id);
  }

  return <TambahRuanganForm buildings={visibleBuildings} />;
}
