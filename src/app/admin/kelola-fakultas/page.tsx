import { getAllFakultas } from '@/lib/fakultas';
import KelolaFakultasClient from './KelolaFakultasClient';

export const revalidate = 0;

export default async function KelolaFakultasPage() {
  const fakultas = await getAllFakultas();
  return <KelolaFakultasClient fakultas={fakultas} />;
}
