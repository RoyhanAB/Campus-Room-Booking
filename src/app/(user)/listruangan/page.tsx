import { Suspense } from 'react';
import styles from './listruangan.module.css';
import { getRoomsLimit15 } from '@/lib/ruangan';
import ListRuanganClient from '../../ListRuanganClient';
import LoadingSkeleton from './loading';

export const revalidate = 0; 

async function RuanganData() {
  const rooms = await getRoomsLimit15();
  return <ListRuanganClient rooms={rooms} basePath="/listruangan" styles={styles} supabaseUrl="" />;
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RuanganData />
    </Suspense>
  );
}