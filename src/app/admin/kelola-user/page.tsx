import { getAllUsersWithProfiles } from '@/lib/user';
import { getAllFakultas } from '@/lib/fakultas';
import KelolaUserClient from './KelolaUserClient';

export const revalidate = 0;

export default async function KelolaUserPage() {
  const [users, fakultas] = await Promise.all([
    getAllUsersWithProfiles(),
    getAllFakultas(),
  ]);

  return <KelolaUserClient users={users} fakultas={fakultas} />;
}
