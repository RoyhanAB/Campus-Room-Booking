import { Suspense } from 'react';
import styles from './listruangan.module.css';
import { getRoomsLimit15, getAllBuildings } from '@/lib/ruangan';
import { getAllFakultas } from '@/lib/fakultas';
import ListRuanganClient from '../../ListRuanganClient';
import LoadingSkeleton from './loading';

export const revalidate = 0; 

async function RuanganData() {
  const [rooms, buildings, fakultas] = await Promise.all([
    getRoomsLimit15(),
    getAllBuildings(),
    getAllFakultas()
  ]);
  
  return (
    <ListRuanganClient 
      rooms={rooms} 
      buildings={buildings}
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