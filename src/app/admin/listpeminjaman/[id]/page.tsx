import { getPeminjamanById } from '@/lib/peminjaman';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, FileText, MapPin, ExternalLink, User } from 'lucide-react';
import styles from './DetailPeminjaman.module.css';
import DetailPeminjamanActions from './DetailPeminjamanActions';
import { formatLocalDateTime } from '@/lib/datetime';
import { getSession } from '@/lib/auth';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { detailroom, getAllBuildings } from '@/lib/ruangan';

export const revalidate = 0;

function getDocumentHref(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(www\.|drive\.google\.com|docs\.google\.com)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

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

  const session = await getSession();
  if (session?.role === 'admin_fakultas') {
    const [adminInfo, room, buildings] = await Promise.all([
      getAdminInfo(session.user_id),
      detailroom(peminjaman.room_id),
      getAllBuildings(),
    ]);
    const building = buildings.find((item) => item.building_id === room.building_id);

    if (!adminInfo?.fakultas_id || building?.fakultas_id !== adminInfo.fakultas_id) {
      return (
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Akses Ditolak</h1>
            <p>Peminjaman ini bukan bagian dari fakultas Anda.</p>
            <Link href="/admin/listpeminjaman" className={styles.backLink}>
              <ArrowLeft size={18} /> Kembali ke List
            </Link>
          </div>
        </div>
      );
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disetujui': return { bg: '#dcfce7', text: '#166534', label: 'Disetujui' };
      case 'ditolak': return { bg: '#fee2e2', text: '#991b1b', label: 'Ditolak' };
      case 'menunggu':
      default: return { bg: '#fef9c3', text: '#854d0e', label: 'Menunggu' };
    }
  };

  const statusStyle = getStatusStyle(peminjaman.status);

  const documentHref = getDocumentHref(peminjaman.dokumen);
  const isExternalDocument = Boolean(documentHref && /^https?:\/\//i.test(documentHref));

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
              {formatLocalDateTime(peminjaman.tanggal_dimulai)}
            </span>
            <span className={styles.infoValueSub}>
              s/d {formatLocalDateTime(peminjaman.tanggal_selesai)}
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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FileText size={16} /> Dokumen Pendukung
        </h2>
        {documentHref ? (
          <a 
            href={documentHref}
            target={isExternalDocument ? '_blank' : undefined}
            rel={isExternalDocument ? 'noopener noreferrer' : undefined}
            className={styles.documentButton}
          >
            <ExternalLink size={16} />
            <span>{peminjaman.dokumen}</span>
          </a>
        ) : (
          <span
            className={styles.documentButtonDisabled}
          >
            <ExternalLink size={16} />
            <span>Tidak ada dokumen</span>
          </span>
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
