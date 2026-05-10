import { FormPeminjamanClient } from './form-peminjaman-client';
import { getSession } from '@/lib/auth';

type SearchParams = Promise<{ roomId?: string | string[] }>;

export default async function FormPeminjamanPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const roomParam = resolvedSearchParams.roomId;
  const defaultRoomId = typeof roomParam === 'string' ? roomParam : '';

  const session = await getSession();

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-8 pb-28">
      <FormPeminjamanClient
        defaultRoomId={defaultRoomId}
        userId={session?.user_id || ''}
        userName={session?.user_name || ''}
      />
    </section>
  );
}
