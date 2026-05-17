import { getPeminjamanById } from '@/lib/peminjaman';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, FileText, MapPin, ExternalLink, User } from 'lucide-react';
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

  // Check if dokumen is a valid URL
  const isDocumentUrl = peminjaman.dokumen && (
    peminjaman.dokumen.startsWith('http://') || 
    peminjaman.dokumen.startsWith('https://')
  );

  // Check capacity warning
  const isOverCapacity = peminjaman.room_kapasitas && 
    peminjaman.jumlah_peserta > peminjaman.room_kapasitas;

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
          <MapPin size={18} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Ruangan</span>
            <span className={styles.infoValue}>{peminjaman.room_id}</span>
          </div>
        </div>
        <div className={styles.infoCard}>
          <User size={18} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Pemohon</span>
            <span className={styles.infoValue}>
              {peminjaman.user_name || peminjaman.user_id}
            </span>
            {peminjaman.user_name && (
              <span className={styles.infoValueSub}>{peminjaman.user_id}</span>
            )}
          </div>
        </div>
        <div className={styles.infoCard}>
          <Users size={18} className={styles.infoIcon} />
          <div>
            <span className={styles.infoLabel}>Jumlah Peserta</span>
            <span className={`${styles.infoValue} ${isOverCapacity ? styles.overCapacity : ''}`}>
              {peminjaman.jumlah_peserta} orang
            </span>
            {peminjaman.room_kapasitas && (
              <span className={`${styles.infoValueSub} ${isOverCapacity ? styles.overCapacityText : ''}`}>
                {isOverCapacity ? '⚠ ' : ''}Kapasitas: {peminjaman.room_kapasitas}
              </span>
            )}
          </div>
        </div>
        <div className={styles.infoCard}>
          <Calendar size={18} className={styles.infoIcon} />
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
          <FileText size={16} /> Deskripsi Kegiatan
        </h2>
        <p className={styles.sectionContent}>
          {peminjaman.deskripsi || 'Tidak ada deskripsi.'}
        </p>
      </div>

      {/* Dokumen — sebagai button */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FileText size={16} /> Dokumen Pendukung
        </h2>
        {isDocumentUrl ? (
          <a 
            href={peminjaman.dokumen} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.documentButton}
          >
            <ExternalLink size={16} />
            <span>Buka Dokumen</span>
          </a>
        ) : (
          <button 
            className={styles.documentButtonDisabled}
            disabled
          >
            <ExternalLink size={16} />
            <span>{peminjaman.dokumen ? peminjaman.dokumen : 'Tidak ada dokumen'}</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <DetailPeminjamanActions
        peminjamanId={peminjaman.peminjaman_id}
        currentStatus={peminjaman.status}
      />
    </div>
  );
}
