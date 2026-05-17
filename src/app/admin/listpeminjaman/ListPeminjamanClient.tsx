'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Eye, Download } from 'lucide-react';
import styles from './ListPeminjaman.module.css';
import { Peminjaman } from '@/types/peminjaman';

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui': return { bg: 'var(--green-50)', text: 'var(--green-700)' };
    case 'ditolak':   return { bg: 'var(--red-50)', text: 'var(--red-600)' };
    case 'dibatalkan': return { bg: '#f3f4f6', text: '#6b7280' };
    case 'menunggu':
    default:          return { bg: 'var(--amber-50)', text: 'var(--amber-700)' };
  }
};

type StatusFilter = 'semua' | 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';

export default function ListPeminjamanClient({ initialData }: { initialData: Peminjaman[] }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') ?? '';
  const initialStatus = (searchParams.get('status') ?? 'semua') as StatusFilter;
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);

  const updateURL = useCallback(
    (search: string, status: StatusFilter) => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (status !== 'semua') params.set('status', status);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL(value, statusFilter);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    updateURL(searchTerm, status);
  };

  const filteredList = initialData.filter((item) => {
    // Filter by status
    if (statusFilter !== 'semua') {
      if ((item.status || 'menunggu').toLowerCase() !== statusFilter) return false;
    }

    // Filter by search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.nama_kegiatan.toLowerCase().includes(q) ||
        item.user_id.toLowerCase().includes(q) ||
        item.room_id.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: initialData.length },
    { key: 'menunggu', label: 'Menunggu', count: initialData.filter(i => (i.status || 'menunggu').toLowerCase() === 'menunggu').length },
    { key: 'disetujui', label: 'Disetujui', count: initialData.filter(i => i.status?.toLowerCase() === 'disetujui').length },
    { key: 'ditolak', label: 'Ditolak', count: initialData.filter(i => i.status?.toLowerCase() === 'ditolak').length },
    { key: 'dibatalkan', label: 'Dibatalkan', count: initialData.filter(i => i.status?.toLowerCase() === 'dibatalkan').length },
  ];

  return (
    <div className={styles.container}>
      {/* Header & Search */}
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Pengajuan Peminjaman</h1>
        <div className={styles.actionArea}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Cari kegiatan, ruangan..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Export + Status Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>

      {/* Status Filter Pills */}
      <div className={styles.filterPills}>
        {statusFilters.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterPill} ${statusFilter === f.key ? styles.filterPillActive : ''}`}
            onClick={() => handleStatusChange(f.key)}
          >
            {f.label}
            <span className={styles.filterPillCount}>{f.count}</span>
          </button>
        ))}
      </div>

        <a
          href="/api/export-csv"
          download
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'var(--green-50)', color: 'var(--green-700)',
            border: '1px solid var(--green-100)', textDecoration: 'none',
            transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Desktop Table View */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Kegiatan</th>
              <th>Ruangan</th>
              <th>User ID</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => {
                const statusStyle = getStatusColor(item.status);
                return (
                  <tr key={item.peminjaman_id}>
                    <td style={{ fontWeight: 600 }}>{item.nama_kegiatan}</td>
                    <td>{item.room_id}</td>
                    <td>{item.user_id}</td>
                    <td>
                      {formatDate(item.tanggal_dimulai)} – {formatDate(item.tanggal_selesai)}
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {item.status || 'menunggu'}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      <Link
                        href={`/admin/listpeminjaman/${item.peminjaman_id}`}
                        className={`${styles.btnAction} ${styles.btnDetail}`}
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                  {searchTerm || statusFilter !== 'semua' ? 'Tidak ada data yang cocok.' : 'Belum ada data pengajuan peminjaman.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {filteredList.length > 0 ? (
          filteredList.map((item) => {
            const statusStyle = getStatusColor(item.status);
            return (
              <div key={item.peminjaman_id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{item.nama_kegiatan}</h3>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                  >
                    {item.status || 'menunggu'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Ruangan:</span>
                    <span className={styles.cardValue}>{item.room_id}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>User ID:</span>
                    <span className={styles.cardValue}>{item.user_id}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Tanggal:</span>
                    <span className={styles.cardValue}>
                      {formatDate(item.tanggal_dimulai)} – {formatDate(item.tanggal_selesai)}
                    </span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <Link
                    href={`/admin/listpeminjaman/${item.peminjaman_id}`}
                    className={styles.btnDetailMobile}
                  >
                    <Eye size={16} />
                    <span>Lihat Detail</span>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            {searchTerm || statusFilter !== 'semua' ? 'Tidak ada data yang cocok.' : 'Belum ada data pengajuan peminjaman.'}
          </div>
        )}
      </div>
    </div>
  );
}
