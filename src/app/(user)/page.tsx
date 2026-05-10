import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 pb-28">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Portal Kampus</p>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Peminjaman Ruangan UNTIRTA</h1>
        {session?.user_name && (
          <p className="mb-4 text-sm text-zinc-500">
            Selamat datang, <span className="font-semibold text-zinc-700">{session.user_name}</span>
          </p>
        )}
        <p className="max-w-2xl text-sm leading-7 text-zinc-600">
          Kelola ketersediaan ruangan, cek jadwal, dan ajukan peminjaman dalam satu aplikasi.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/listruangan"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Lihat Ruangan
          </Link>
          <Link
            href="/formpeminjaman"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
          >
            Ajukan Peminjaman
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Panduan Peminjaman</h2>
          <p className="text-sm leading-6 text-zinc-600">
            Pastikan data kegiatan, waktu, dan jumlah peserta sesuai sebelum mengirim permohonan.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Dokumen Wajib</h2>
          <ul className="list-disc pl-5 text-sm leading-7 text-zinc-600">
            <li>Surat permohonan resmi</li>
            <li>Proposal kegiatan (opsional)</li>
          </ul>
        </article>
      </div>
    </section>
  );
}