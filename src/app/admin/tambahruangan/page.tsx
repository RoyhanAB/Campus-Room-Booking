import { getAllBuildings } from '@/lib/ruangan';
import TambahRuanganForm from './TambahRuanganForm';

export const revalidate = 0;

export default async function TambahRuanganPage() {
  const buildings = await getAllBuildings();

  return <TambahRuanganForm buildings={buildings} />;
}
