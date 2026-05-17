'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPeminjaman } from '@/lib/peminjaman';
import { ArrowLeft, Users, FileText, Link as LinkIcon, Send, Building2, ClipboardList, Clock, Layers } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './formpeminjaman.module.css';

interface Room {
  room_id: string;
  building_id: number;
  floor: number;
  kapasitas: number;
  deskripsi: string;
  foto: string;
}

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

// Min date: sekarang (tidak boleh booking masa lalu)
const minDateTime = toDatetimeLocal(new Date());

export function FormPeminjamanClient({
  defaultRoomId,
  userId,
  userName,
  room,
  buildingName,
}: {
  defaultRoomId: string;
  userId: string;
  userName: string;
  room: Room;
  buildingName: string;
}) {
  const router = useRouter();
  const [roomId] = useState(defaultRoomId);
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(defaultDateRange.start);
  const [tanggalSelesai, setTanggalSelesai] = useState(defaultDateRange.end);
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahPeserta, setJumlahPeserta] = useState('');
  const [dokumen, setDokumen] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    const { data } = supabase.storage.from('Foto').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleTanggalMulaiChange = (value: string) => {
    setTanggalMulai(value);
    // Auto-update tanggal selesai jika lebih kecil dari tanggal mulai
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

    if (room.kapasitas && pesertaNum > room.kapasitas) {
      setStatus('error');
      setMessage(`Jumlah peserta (${pesertaNum}) melebihi kapasitas ruangan (${room.kapasitas} orang).`);
      return;
    }

    if (new Date(tanggalSelesai) <= new Date(tanggalMulai)) {
      setStatus('error');
      setMessage('Tanggal selesai harus lebih besar dari tanggal mulai.');
      return;
    }

    // Validasi: tidak boleh booking di masa lalu
    if (new Date(tanggalMulai) < new Date()) {
      setStatus('error');
      setMessage('Tidak dapat membuat booking untuk waktu yang sudah lewat.');
      return;
    }

    // Cek jadwal conflict sebelum submit
    try {
      setStatus('loading');
      setMessage('Memeriksa ketersediaan jadwal...');
      const res = await fetch(`/api/check-conflict?room_id=${roomId.trim().toUpperCase()}&start=${new Date(tanggalMulai).toISOString()}&end=${new Date(tanggalSelesai).toISOString()}`);
      const conflictData = await res.json();
      if (conflictData.hasConflict) {
        setStatus('error');
        setMessage(`Jadwal bentrok dengan: ${conflictData.names}. Silakan pilih waktu lain.`);
        return;
      }
    } catch {
      // Lanjutkan jika conflict check gagal
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
      
      // Redirect ke history setelah 1 detik
      setTimeout(() => {
        router.push('/history');
      }, 1000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Gagal mengirim pengajuan.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className={styles.backButton}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        {/* Room Image & Info */}
        <div className={styles.roomSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={getImageUrl(room.foto)}
              alt={`Ruangan ${room.room_id}`}
              fill
              className={styles.roomImage}
              priority
              sizes="(max-width: 768px) 100vw, 700px"
            />
            <div className={styles.roomBadge}>{room.room_id}</div>
          </div>

          <div className={styles.roomInfo}>
            <h1 className={styles.roomTitle}>{buildingName}</h1>
            <p className={styles.roomDesc}>{room.deskripsi || 'Ruangan kampus'}</p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Building2 size={20} strokeWidth={2.5} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>GEDUNG</span>
                  <span className={styles.infoValue}>{buildingName}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Layers size={20} strokeWidth={2.5} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>LANTAI</span>
                  <span className={styles.infoValue}>{room.floor}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>KAPASITAS</span>
                  <span className={styles.infoValue}>{room.kapasitas} orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Form Peminjaman</h2>
            <p className={styles.formSubtitle}>Lengkapi data berikut untuk mengajukan peminjaman</p>
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
                  min={minDateTime}
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
                  min={tanggalMulai || minDateTime}
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
              <span className={styles.helperText}>
                Maksimal {room.kapasitas} orang (kapasitas ruangan)
              </span>
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
      </div>
    </div>
  );
}
