import { Suspense } from 'react';
import { getAllPeminjamanSorted, getPeminjamanByFakultas } from '@/lib/peminjaman';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import ListPeminjamanClient from './ListPeminjamanClient';
import ListPeminjamanSkeleton from './ListPeminjamanSkeleton';

export const revalidate = 0;

async function PeminjamanData() {
  const session = await getSession();
  
  // Cek apakah admin punya fakultas
  let peminjamanList;
  if (session?.user_id) {
    const adminInfo = await getAdminInfo(session.user_id);
    
    if (adminInfo && adminInfo.fakultas_id) {
      // Admin dengan fakultas: hanya tampilkan peminjaman di fakultasnya
      peminjamanList = await getPeminjamanByFakultas(adminInfo.fakultas_id);
    } else {
      // Admin tanpa fakultas atau super admin: tampilkan semua
      peminjamanList = await getAllPeminjamanSorted();
    }
  } else {
    peminjamanList = await getAllPeminjamanSorted();
  }
  
  return <ListPeminjamanClient initialData={peminjamanList} />;
}

export default function ListPeminjamanPage() {
  return (
    <Suspense fallback={<ListPeminjamanSkeleton />}>
      <PeminjamanData />
    </Suspense>
  );
}