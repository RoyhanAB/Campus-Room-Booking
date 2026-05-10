import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Peminjaman } from '@/types/peminjaman';

export const revalidate = 0;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui':
      return { bg: '#dcfce7', text: '#166534' };
    case 'ditolak':
      return { bg: '#fee2e2', text: '#991b1b' };
    case 'menunggu':
    default:
      return { bg: '#fef9c3', text: '#854d0e' };
  }
};

export default async function HistoryPage() {
  const session = await getSession();

  // Ambil peminjaman hanya milik user yang login
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .eq('user_id', session?.user_id || '')
    .order('created_at', { ascending: false })
    .limit(30);

  const peminjamanList = (error ? [] : data ?? []) as Peminjaman[];

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-8 pb-28">
      <h1 className="mb-4 text-2xl font-bold text-zinc-900">Riwayat Peminjaman</h1>

      {peminjamanList.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
          Belum ada data peminjaman.
        </div>
      ) : (
        <div className="grid gap-3">
          {peminjamanList.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <article key={item.peminjaman_id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-zinc-900">{item.nama_kegiatan}</h2>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                  >
                    {item.status || 'Menunggu'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">
                  Ruangan: <span className="font-medium text-zinc-800">{item.room_id}</span>
                </p>
                <p className="text-sm text-zinc-600">
                  Jadwal: {formatDateTime(item.tanggal_dimulai)} - {formatDateTime(item.tanggal_selesai)}
                </p>
                {item.deskripsi && <p className="mt-2 text-sm text-zinc-700">{item.deskripsi}</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}