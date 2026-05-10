import { Suspense } from 'react';
import { getAllPeminjaman } from '@/lib/peminjaman';
import ListPeminjamanClient from './ListPeminjamanClient';
import ListPeminjamanSkeleton from './ListPeminjamanSkeleton';

export const revalidate = 0;

async function PeminjamanData() {
  const peminjamanList = await getAllPeminjaman();
  return <ListPeminjamanClient initialData={peminjamanList} />;
}

export default function ListPeminjamanPage() {
  return (
    <Suspense fallback={<ListPeminjamanSkeleton />}>
      <PeminjamanData />
    </Suspense>
  );
}