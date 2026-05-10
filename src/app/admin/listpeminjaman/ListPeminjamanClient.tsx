'use client';

import { useState, useTransition, useOptimistic, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, Check, X, Eye } from 'lucide-react';
import styles from './ListPeminjaman.module.css';
import { Peminjaman } from '@/types/peminjaman';
import { approvePeminjamanAction, rejectPeminjamanAction } from '../actions';

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui': return { bg: '#dcfce7', text: '#166534' };
    case 'ditolak':   return { bg: '#fee2e2', text: '#991b1b' };
    case 'menunggu':
    default:          return { bg: '#fef9c3', text: '#854d0e' };
  }
};

type OptimisticAction = { id: number; status: 'disetujui' | 'ditolak' };

export default function ListPeminjamanClient({ initialData }: { initialData: Peminjaman[] }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  // --- DoD #3: URL-persisted search ---
  const initialQ = searchParams.get('q') ?? '';
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [isPending, startTransition] = useTransition();

  const updateSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // --- DoD #4: Optimistic UI ---
  const [optimisticList, addOptimistic] = useOptimistic<Peminjaman[], OptimisticAction>(
    initialData,
    (current, { id, status }) =>
      current.map((item) =>
        item.peminjaman_id === id ? { ...item, status } : item,
      ),
  );

  const filteredList = optimisticList.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.nama_kegiatan.toLowerCase().includes(q) ||
      item.user_id.toLowerCase().includes(q) ||
      item.room_id.toLowerCase().includes(q)
    );
  });

  const handleApprove = (id: number) => {
    startTransition(async () => {
      addOptimistic({ id, status: 'disetujui' });
      await approvePeminjamanAction(id);
      router.refresh();
    });
  };

  const handleReject = (id: number) => {
    startTransition(async () => {
      addOptimistic({ id, status: 'ditolak' });
      await rejectPeminjamanAction(id);
      router.refresh();
    });
  };

  return (
    <div className={styles.container}>
      {/* Header & Search */}
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>List Pengajuan</h1>
        <div className={styles.actionArea}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Cari kegiatan, ruangan, atau peminjam..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </div>
          <button className={styles.filterButton} aria-label="Filter">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
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
                const isProcessed = item.status === 'disetujui' || item.status === 'ditolak';
                return (
                  <tr key={item.peminjaman_id} style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
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
                      <button
                        className={`${styles.btnAction} ${styles.btnAcc}`}
                        title="Setujui"
                        disabled={isPending || item.status === 'disetujui'}
                        onClick={() => handleApprove(item.peminjaman_id)}
                        style={isProcessed && item.status !== 'menunggu' ? { opacity: item.status === 'disetujui' ? 0.35 : 1 } : {}}
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnReject}`}
                        title="Tolak"
                        disabled={isPending || item.status === 'ditolak'}
                        onClick={() => handleReject(item.peminjaman_id)}
                        style={isProcessed && item.status !== 'menunggu' ? { opacity: item.status === 'ditolak' ? 0.35 : 1 } : {}}
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  {searchTerm ? 'Tidak ada data yang cocok.' : 'Belum ada data pengajuan peminjaman.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
