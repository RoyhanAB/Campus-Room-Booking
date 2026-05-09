import { Search, SlidersHorizontal, Check, X, Eye } from 'lucide-react';
import styles from './ListPeminjaman.module.css';
import { getAllPeminjaman } from '@/lib/peminjaman';

// Matikan cache agar data tabel selalu fresh
export const revalidate = 0;

export default async function ListPeminjamanPage() {
  // Ambil data dari Supabase
  const peminjamanList = await getAllPeminjaman();

  // Helper untuk format tanggal
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Helper untuk warna status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disetujui': return { bg: '#dcfce7', text: '#166534' }; // Hijau muda
      case 'ditolak': return { bg: '#fee2e2', text: '#991b1b' }; // Merah muda
      default: return { bg: '#fef9c3', text: '#854d0e' }; // Kuning (Pending)
    }
  };

  return (
    <div className={styles.container}>
      {/* Header & Search/Filter */}
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>List Pengajuan</h1>
        
        <div className={styles.actionArea}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Cari kegiatan atau peminjam..."
              className={styles.searchInput}
            />
          </div>
          <button className={styles.filterButton}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Table Container */}
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
            {peminjamanList && peminjamanList.length > 0 ? (
              peminjamanList.map((item) => {
                const statusStyle = getStatusColor(item.status);
                
                return (
                  <tr key={item.peminjaman_id}>
                    <td style={{ fontWeight: 600 }}>{item.nama_kegiatan}</td>
                    <td>{item.room_id}</td>
                    <td>{item.user_id}</td>
                    <td>
                      {formatDate(item.tanggal_dimulai)} - {formatDate(item.tanggal_selesai)}
                    </td>
                    <td>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      {/* Tombol Acc (Hijau) */}
                      <button className={`${styles.btnAction} ${styles.btnAcc}`} title="Setujui">
                        <Check size={16} strokeWidth={3} />
                      </button>
                      
                      {/* Tombol Reject (Merah) */}
                      <button className={`${styles.btnAction} ${styles.btnReject}`} title="Tolak">
                        <X size={16} strokeWidth={3} />
                      </button>
                      
                      {/* Tombol Detail (Biru) */}
                      <button className={`${styles.btnAction} ${styles.btnDetail}`} title="Lihat Detail">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Belum ada data pengajuan peminjaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}