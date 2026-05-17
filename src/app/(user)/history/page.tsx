import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Peminjaman } from '@/types/peminjaman';
import HistoryClient from './HistoryClient';

export const revalidate = 0;

export default async function HistoryPage() {
  const session = await getSession();

  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .eq('user_id', session?.user_id || '')
    .order('created_at', { ascending: false })
    .limit(100);

  const peminjamanList = (error ? [] : data ?? []) as Peminjaman[];

  return <HistoryClient peminjamanList={peminjamanList} />;
}