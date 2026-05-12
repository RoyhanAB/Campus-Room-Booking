import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Peminjaman } from '@/types/peminjaman';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import styles from './history.module.css';

export const revalidate = 0;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui':
      return { 
        label: 'Disetujui', 
        className: styles.statusApproved,
        icon: '✓'
      };
    case 'ditolak':
      return { 
        label: 'Ditolak', 
        className: styles.statusRejected,
        icon: '✕'
      };
    case 'menunggu':
    default:
      return { 
        label: 'Menunggu', 
        className: styles.statusPending,
        icon: '○'
      };
  }
};

export default async function HistoryPage() {
  const session = await getSession();

  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .eq('user_id', session?.user_id || '')
    .order('created_at', { ascending: false })
    .limit(50);

  const peminjamanList = (error ? [] : data ?? []) as Peminjaman[];

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Riwayat Booking</h1>
          <p className={styles.subtitle}>
            Pantau status pengajuan peminjaman ruangan Anda
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {peminjamanList.filter(p => p.status === 'menunggu').length}
            </span>
            <span className={styles.statLabel}>Menunggu</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {peminjamanList.filter(p => p.status === 'disetujui').length}
            </span>
            <span className={styles.statLabel}>Disetujui</span>
          </div>
        </div>
      </div>

      {peminjamanList.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={48} />
          </div>
          <h3>Belum Ada Riwayat</h3>
          <p>Anda belum pernah mengajukan peminjaman ruangan</p>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {peminjamanList.map((item) => {
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
                      {formatDate(item.tanggal_dimulai)}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <Clock size={16} />
                    <span className={styles.infoLabel}>Waktu:</span>
                    <span className={styles.infoValue}>
                      {formatTime(item.tanggal_dimulai)} - {formatTime(item.tanggal_selesai)}
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}