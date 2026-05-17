import { getAllBuildingsWithFakultas } from '@/lib/building';
import { getAllFakultas } from '@/lib/fakultas';
import KelolaGedungClient from './KelolaGedungClient';

export const revalidate = 0;

export default async function KelolaGedungPage() {
  const [buildings, fakultas] = await Promise.all([
    getAllBuildingsWithFakultas(),
    getAllFakultas(),
  ]);

  return <KelolaGedungClient buildings={buildings} fakultas={fakultas} />;
}
