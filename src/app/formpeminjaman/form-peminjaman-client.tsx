'use client';

import { FormEvent, useState } from 'react';
import { createPeminjaman } from '@/lib/peminjaman';

const toDatetimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const defaultDateRange = (() => {
  const now = new Date();
  return {
    start: toDatetimeLocal(now),
    end: toDatetimeLocal(new Date(now.getTime() + 60 * 60 * 1000)),
  };
})();

export function FormPeminjamanClient({ defaultRoomId }: { defaultRoomId: string }) {
  const [roomId, setRoomId] = useState(defaultRoomId);
  const [userId, setUserId] = useState('u001');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(defaultDateRange.start);
  const [tanggalSelesai, setTanggalSelesai] = useState(defaultDateRange.end);
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahPeserta, setJumlahPeserta] = useState(1);
  const [dokumen, setDokumen] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roomId.trim() || !userId.trim()) {
      setStatus('error');
      setMessage('Room ID dan User ID wajib diisi.');
      return;
    }

    if (new Date(tanggalSelesai) <= new Date(tanggalMulai)) {
      setStatus('error');
      setMessage('Tanggal selesai harus lebih besar dari tanggal mulai.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Menyimpan pengajuan...');

      await createPeminjaman({
        room_id: roomId.trim().toUpperCase(),
        user_id: userId.trim(),
        nama_kegiatan: namaKegiatan.trim(),
        tanggal_dimulai: new Date(tanggalMulai).toISOString(),
        tanggal_selesai: new Date(tanggalSelesai).toISOString(),
        deskripsi: deskripsi.trim(),
        jumlah_peserta: Number(jumlahPeserta),
        dokumen: dokumen.trim(),
      });

      setStatus('success');
      setMessage('Pengajuan peminjaman berhasil dikirim.');
      setNamaKegiatan('');
      setDeskripsi('');
      setDokumen('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Gagal mengirim pengajuan.');
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Form Peminjaman Ruangan</h1>
      <p className="mb-6 text-sm text-zinc-600">Isi data berikut untuk mengajukan peminjaman ruangan.</p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-sm text-zinc-700">
          Room ID
          <input
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="Contoh: A101"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          User ID
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="Contoh: u001"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Nama Kegiatan
          <input
            value={namaKegiatan}
            onChange={(event) => setNamaKegiatan(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Tanggal Mulai
          <input
            type="datetime-local"
            value={tanggalMulai}
            onChange={(event) => setTanggalMulai(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Tanggal Selesai
          <input
            type="datetime-local"
            value={tanggalSelesai}
            onChange={(event) => setTanggalSelesai(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Jumlah Peserta
          <input
            type="number"
            min={1}
            value={jumlahPeserta}
            onChange={(event) => setJumlahPeserta(Number(event.target.value))}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Deskripsi
          <textarea
            value={deskripsi}
            onChange={(event) => setDeskripsi(event.target.value)}
            className="min-h-24 rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Dokumen (tautan)
          <input
            value={dokumen}
            onChange={(event) => setDokumen(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="https://..."
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {status === 'loading' ? 'Mengirim...' : 'Kirim Pengajuan'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            status === 'success' ? 'text-emerald-700' : status === 'error' ? 'text-red-600' : 'text-zinc-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
