import { getAdminsWithFakultas } from '@/lib/user';
import { getAllFakultas } from '@/lib/fakultas';
import KelolaAdminClient from './KelolaAdminClient';

export const revalidate = 0;

export default async function KelolaAdminPage() {
  const [admins, fakultas] = await Promise.all([
    getAdminsWithFakultas(),
    getAllFakultas(),
  ]);

  return <KelolaAdminClient admins={admins} fakultas={fakultas} />;
}
