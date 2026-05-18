'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, FileText, XCircle } from 'lucide-react';
import { cancelBookingAction } from './cancel-action';
import { Peminjaman } from '@/types/peminjaman';
import { formatLocalDate, formatLocalTime } from '@/lib/datetime';
import styles from './history.module.css';

const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui':
      return { label: 'Disetujui', className: styles.statusApproved, icon: '✓' };
    case 'ditolak':
      return { label: 'Ditolak', className: styles.statusRejected, icon: '✕' };
    case 'dibatalkan':
      return { label: 'Dibatalkan', className: styles.statusCancelled, icon: '⊘' };
    case 'menunggu':
    default:
      return { label: 'Menunggu', className: styles.statusPending, icon: '○' };
  }
};

const filterTabs = [
  { key: 'semua', label: 'Semua' },
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'disetujui', label: 'Disetujui' },
  { key: 'ditolak', label: 'Ditolak' },
  { key: 'dibatalkan', label: 'Dibatalkan' },
];

export default function HistoryClient({ peminjamanList }: { peminjamanList: Peminjaman[] }) {
  const [filter, setFilter] = useState('semua');
  const [isPending, startTransition] = useTransition();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const router = useRouter();

  const filtered = filter === 'semua'
    ? peminjamanList
    : peminjamanList.filter(p => p.status?.toLowerCase() === filter);

  const counts = {
    semua: peminjamanList.length,
    menunggu: peminjamanList.filter(p => p.status === 'menunggu').length,
    disetujui: peminjamanList.filter(p => p.status === 'disetujui').length,
    ditolak: peminjamanList.filter(p => p.status === 'ditolak').length,
    dibatalkan: peminjamanList.filter(p => p.status === 'dibatalkan').length,
  };

  const handleCancel = (id: number) => {
    if (!confirm('Yakin ingin membatalkan peminjaman ini?')) return;
    setCancellingId(id);
    startTransition(async () => {
      const result = await cancelBookingAction(id);
      if (!result.success) {
        alert(result.error || 'Gagal membatalkan.');
      }
      setCancellingId(null);
      router.refresh();
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Riwayat Peminjaman</h1>
          <p className={styles.subtitle}>
            Daftar pengajuan peminjaman ruangan yang pernah Anda ajukan
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{counts.menunggu}</span>
            <span className={styles.statLabel}>Menunggu</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{counts.disetujui}</span>
            <span className={styles.statLabel}>Disetujui</span>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className={styles.filterBar}>
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.filterPill} ${filter === tab.key ? styles.filterPillActive : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className={styles.filterCount}>{counts[tab.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={48} />
          </div>
          <h3>Tidak Ada Data</h3>
          <p>{filter === 'semua' ? 'Anda belum pernah mengajukan peminjaman ruangan' : `Tidak ada peminjaman dengan status "${filter}"`}</p>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {filtered.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <article key={item.peminjaman_id} className={styles.bookingCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.eventName}>{item.nama_kegiatan}</h3>
                  <span className={`${styles.statusBadge} ${statusConfig.className}`}>
                    <span className={styles.statusIcon}>{statusConfig.icon}</span>
                    {statusConfig.label}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <MapPin size={16} />
                    <span className={styles.infoLabel}>Ruangan:</span>
                    <span className={styles.infoValue}>{item.room_id}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <Calendar size={16} />
                    <span className={styles.infoLabel}>Tanggal:</span>
                    <span className={styles.infoValue}>
                      {formatLocalDate(item.tanggal_dimulai)}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <Clock size={16} />
                    <span className={styles.infoLabel}>Waktu:</span>
                    <span className={styles.infoValue}>
                      {formatLocalTime(item.tanggal_dimulai)} - {formatLocalTime(item.tanggal_selesai)}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.participantsBadge}>
                      {item.jumlah_peserta} peserta
                    </span>
                  </div>

                  {item.status === 'ditolak' && item.alasan_penolakan && (
                    <div className={styles.rejectionReason}>
                      <span className={styles.rejectionLabel}>Alasan Penolakan:</span>
                      <p className={styles.rejectionText}>{item.alasan_penolakan}</p>
                    </div>
                  )}

                  {/* Cancel button for pending bookings */}
                  {item.status === 'menunggu' && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancel(item.peminjaman_id)}
                      disabled={isPending && cancellingId === item.peminjaman_id}
                    >
                      <XCircle size={14} />
                      {isPending && cancellingId === item.peminjaman_id
                        ? 'Membatalkan...'
                        : 'Batalkan Peminjaman'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
