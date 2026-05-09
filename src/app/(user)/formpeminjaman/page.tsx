import { FormPeminjamanClient } from './form-peminjaman-client';

type SearchParams = Promise<{ roomId?: string | string[] }>;

export default async function FormPeminjamanPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const roomParam = resolvedSearchParams.roomId;
  const defaultRoomId = typeof roomParam === 'string' ? roomParam : '';

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-8 pb-28">
      <FormPeminjamanClient defaultRoomId={defaultRoomId} />
    </section>
  );
}
