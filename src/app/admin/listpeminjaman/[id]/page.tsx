import { getPeminjamanById } from '@/lib/peminjaman';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, FileText, MapPin } from 'lucide-react';
import styles from './DetailPeminjaman.module.css';
import DetailPeminjamanActions from './DetailPeminjamanActions';

export const revalidate = 0;

export default async function DetailPeminjamanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  const peminjaman = await getPeminjamanById(id);

  if (!peminjaman) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Data Tidak Ditemukan</h1>
          <p>Peminjaman dengan ID tersebut tidak ditemukan.</p>
          <Link href="/admin/listpeminjaman" className={styles.backLink}>
            <ArrowLeft size={18} /> Kembali ke List
          </Link>
        </div>
      </div>
    );
  }

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disetujui': return { bg: '#dcfce7', text: '#166534', label: 'Disetujui' };
      case 'ditolak': return { bg: '#fee2e2', text: '#991b1b', label: 'Ditolak' };
      case 'menunggu':
      default: return { bg: '#fef9c3', text: '#854d0e', label: 'Menunggu' };
    }
  };

  const statusStyle = getStatusStyle(peminjaman.status);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/listpeminjaman" className={styles.backLink}>
          <ArrowLeft size={18} /> Kembali
        </Link>
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {statusStyle.label}
        </span>
      </div>

      <h1 className={styles.title}>{peminjaman.nama_kegiatan}</h1>
      <p className={styles.subtitle}>ID Peminjaman: #{peminjaman.peminjaman_id}</p>

      {/* Info Cards */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <MapPin size={20} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Ruangan</span>
            <span className={styles.infoValue}>{peminjaman.room_id}</span>
          </div>
        </div>
        <div className={styles.infoCard}>
          <Users size={20} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Pemohon</span>
            <span className={styles.infoValue}>{peminjaman.user_id}</span>
          </div>
        </div>
        <div className={styles.infoCard}>
          <Users size={20} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Jumlah Peserta</span>
            <span className={styles.infoValue}>{peminjaman.jumlah_peserta} orang</span>
          </div>
        </div>
        <div className={styles.infoCard}>
          <Calendar size={20} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Waktu</span>
            <span className={styles.infoValue}>
              {formatDateTime(peminjaman.tanggal_dimulai)}
            </span>
            <span className={styles.infoValueSub}>
              s/d {formatDateTime(peminjaman.tanggal_selesai)}
            </span>
          </div>
        </div>
      </div>

      {/* Deskripsi */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FileText size={18} /> Deskripsi Kegiatan
        </h2>
        <p className={styles.sectionContent}>
          {peminjaman.deskripsi || 'Tidak ada deskripsi.'}
        </p>
      </div>

      {/* Dokumen */}
      {peminjaman.dokumen && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FileText size={18} /> Dokumen
          </h2>
          {peminjaman.dokumen.startsWith('http') ? (
            <a 
              href={peminjaman.dokumen} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.documentLink}
            >
              {peminjaman.dokumen}
            </a>
          ) : (
            <p className={styles.sectionContent}>{peminjaman.dokumen}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <DetailPeminjamanActions
        peminjamanId={peminjaman.peminjaman_id}
        currentStatus={peminjaman.status}
      />
    </div>
  );
}
