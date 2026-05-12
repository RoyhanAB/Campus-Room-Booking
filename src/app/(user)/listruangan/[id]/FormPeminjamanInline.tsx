'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPeminjaman } from '@/lib/peminjaman';
import { Users, FileText, Link as LinkIcon, Send, ClipboardList, Clock } from 'lucide-react';
import styles from './roomdetail.module.css';

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

export function FormPeminjamanInline({
  roomId,
  userId,
  userName,
}: {
  roomId: string;
  userId: string;
  userName: string;
}) {
  const router = useRouter();
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(defaultDateRange.start);
  const [tanggalSelesai, setTanggalSelesai] = useState(defaultDateRange.end);
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahPeserta, setJumlahPeserta] = useState('');
  const [dokumen, setDokumen] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTanggalMulaiChange = (value: string) => {
    setTanggalMulai(value);
    if (tanggalSelesai && new Date(value) >= new Date(tanggalSelesai)) {
      const newEnd = new Date(new Date(value).getTime() + 60 * 60 * 1000);
      setTanggalSelesai(toDatetimeLocal(newEnd));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roomId.trim()) {
      setStatus('error');
      setMessage('Room ID wajib diisi.');
      return;
    }

    const pesertaNum = parseInt(jumlahPeserta);
    if (!jumlahPeserta || pesertaNum < 1) {
      setStatus('error');
      setMessage('Jumlah peserta minimal 1 orang.');
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
        user_id: userId,
        nama_kegiatan: namaKegiatan.trim(),
        tanggal_dimulai: new Date(tanggalMulai).toISOString(),
        tanggal_selesai: new Date(tanggalSelesai).toISOString(),
        deskripsi: deskripsi.trim(),
        jumlah_peserta: pesertaNum,
        dokumen: dokumen.trim(),
      });

      setStatus('success');
      setMessage('✓ Pengajuan berhasil dikirim! Mengalihkan ke riwayat...');
      
      setTimeout(() => {
        router.push('/history');
      }, 1000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Gagal mengirim pengajuan.');
    }
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Form Peminjaman</h2>
        <p className={styles.formSubtitle}>Lengkapi data berikut untuk mengajukan peminjaman ruangan</p>
      </div>

      {/* User Info */}
      <div className={styles.userInfo}>
        <div className={styles.userInfoHeader}>
          <Users size={18} strokeWidth={2.5} />
          <span className={styles.userLabel}>Informasi Pemohon</span>
        </div>
        <p className={styles.userName}>{userName}</p>
        <span className={styles.userId}>{userId}</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Nama Kegiatan */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="namaKegiatan">
            <ClipboardList size={18} strokeWidth={2.5} />
            <span>Nama Kegiatan <span className={styles.required}>*</span></span>
          </label>
          <input
            id="namaKegiatan"
            value={namaKegiatan}
            onChange={(event) => setNamaKegiatan(event.target.value)}
            className={styles.input}
            placeholder="Contoh: Rapat Koordinasi Tim"
            required
          />
        </div>

        {/* Date Grid */}
        <div className={styles.dateGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="tanggalMulai">
              <Clock size={18} strokeWidth={2.5} />
              <span>Tanggal Mulai <span className={styles.required}>*</span></span>
            </label>
            <input
              id="tanggalMulai"
              type="datetime-local"
              value={tanggalMulai}
              onChange={(event) => handleTanggalMulaiChange(event.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="tanggalSelesai">
              <Clock size={18} strokeWidth={2.5} />
              <span>Tanggal Selesai <span className={styles.required}>*</span></span>
            </label>
            <input
              id="tanggalSelesai"
              type="datetime-local"
              value={tanggalSelesai}
              min={tanggalMulai}
              onChange={(event) => setTanggalSelesai(event.target.value)}
              className={styles.input}
              required
            />
          </div>
        </div>

        {/* Jumlah Peserta */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="jumlahPeserta">
            <Users size={18} strokeWidth={2.5} />
            <span>Jumlah Peserta <span className={styles.required}>*</span></span>
          </label>
          <input
            id="jumlahPeserta"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={jumlahPeserta}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, '');
              setJumlahPeserta(value);
            }}
            className={styles.input}
            placeholder="Masukkan jumlah peserta"
            required
          />
          <span className={styles.helperText}>Masukkan angka saja (contoh: 25)</span>
        </div>

        {/* Deskripsi */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="deskripsi">
            <FileText size={18} strokeWidth={2.5} />
            <span>Deskripsi <span className={styles.required}>*</span></span>
          </label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(event) => setDeskripsi(event.target.value)}
            className={styles.textarea}
            placeholder="Jelaskan tujuan dan detail peminjaman ruangan..."
            required
          />
        </div>

        {/* Dokumen */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="dokumen">
            <LinkIcon size={18} strokeWidth={2.5} />
            <span>Dokumen Pendukung</span>
          </label>
          <input
            id="dokumen"
            value={dokumen}
            onChange={(event) => setDokumen(event.target.value)}
            className={styles.input}
            placeholder="https://drive.google.com/..."
          />
          <span className={styles.helperText}>Opsional - Link dokumen pendukung</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={styles.submitButton}
        >
          <Send size={20} strokeWidth={2.5} />
          <span>{status === 'loading' ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`${styles.message} ${
            status === 'success' 
              ? styles.messageSuccess
              : status === 'error' 
              ? styles.messageError
              : styles.messageLoading
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
