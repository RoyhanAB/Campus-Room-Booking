import Link from 'next/link';
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  PlusSquare,
  XCircle,
} from 'lucide-react';
import styles from './HomeAdmin.module.css';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { getSession } from '@/lib/auth';
import { getRecentPeminjamanByFakultas, getRecentPeminjaman, countPeminjamanByStatus, countRoomsByFakultas } from '@/lib/peminjaman';
import { formatLocalDateTime } from '@/lib/datetime';

export const revalidate = 0;

const statusLookup = (status: string | null | undefined) => {
  const value = (status || 'menunggu').toLowerCase();
  if (value === 'disetujui') {
    return { label: 'Disetujui', className: styles.recentStatusOk };
  }
  if (value === 'ditolak') {
    return { label: 'Ditolak', className: styles.recentStatusNo };
  }
  return { label: 'Menunggu', className: styles.recentStatusWait };
};

export default async function AdminHomePage() {
  const session = await getSession();
  const currentUserId = session?.user_id || '';
  const isSuperAdmin = session?.role === 'super_admin';

  const adminInfo = await getAdminInfo(currentUserId);
  const fakultasId = isSuperAdmin ? undefined : adminInfo?.fakultas_id;

  const userName = isSuperAdmin ? 'Super Admin' : (adminInfo?.user?.user_name || session?.user_name || 'Admin');
  const facultyName = isSuperAdmin ? 'Semua Fakultas' : (adminInfo?.fakultas?.fakultas_name || 'Fakultas Tidak Diketahui');

  // Super admin: semua data. Admin biasa: filter per fakultas
  const [totalRooms, pendingCount, approvedCount, rejectedCount, recent] = await Promise.all([
    countRoomsByFakultas(fakultasId),
    countPeminjamanByStatus('menunggu', fakultasId),
    countPeminjamanByStatus('disetujui', fakultasId),
    countPeminjamanByStatus('ditolak', fakultasId),
    fakultasId
      ? getRecentPeminjamanByFakultas(fakultasId, 5)
      : getRecentPeminjaman(5),
  ]);

  const stats = [
    {
      label: 'Total Ruangan',
      value: totalRooms,
      icon: Building,
      iconClass: styles.statIconAmber,
    },
    {
      label: 'Menunggu',
      value: pendingCount,
      icon: Clock,
      iconClass: styles.statIconBlue,
    },
    {
      label: 'Disetujui',
      value: approvedCount,
      icon: CheckCircle2,
      iconClass: styles.statIconGreen,
    },
    {
      label: 'Ditolak',
      value: rejectedCount,
      icon: XCircle,
      iconClass: styles.statIconRed,
    },
  ];

  const quickActions = [
    {
      href: '/admin/listpeminjaman',
      title: 'Kelola Peminjaman',
      description: 'Tinjau dan setujui pengajuan mahasiswa.',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} baru` : null,
    },
    {
      href: '/admin/tambahruangan',
      title: 'Tambah Ruangan',
      description: 'Daftarkan ruangan baru ke sistem.',
      icon: PlusSquare,
      badge: null,
    },
    {
      href: '/admin/listruangan',
      title: 'Daftar Ruangan',
      description: 'Edit atau hapus ruangan terdaftar.',
      icon: Building,
      badge: null,
    },
  ];

  return (
    <section className={styles.page}>
      {/* Welcome */}
      <div className={styles.welcome}>
        <div className={styles.welcomeText}>
          <p className={styles.greeting}>
            Selamat datang, <strong>{userName}</strong>
          </p>
          <h1 className={styles.facultyName}>{facultyName}</h1>
          <p className={styles.welcomeSub}>
            Kelola ruangan dan persetujuan peminjaman dari dashboard ini.
          </p>
        </div>
        <div className={styles.welcomeActions}>
          <Link href="/admin/listpeminjaman" className={styles.btnPrimary}>
            Lihat Peminjaman
            <ArrowRight size={15} />
          </Link>
          <Link href="/admin/tambahruangan" className={styles.btnSecondary}>
            Tambah Ruangan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={`${styles.statIcon} ${stat.iconClass}`}>
                  <Icon size={16} strokeWidth={2} />
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* Panels */}
      <div className={styles.panelGrid}>
        {/* Recent */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Peminjaman Terbaru</h2>
            <Link href="/admin/listpeminjaman" className={styles.panelLink}>
              Semua <ChevronRight size={14} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className={styles.emptyState}>
              <ClipboardList size={20} />
              <span>Belum ada pengajuan peminjaman.</span>
            </div>
          ) : (
            <div className={styles.recentList}>
              {recent.map((item) => {
                const status = statusLookup(item.status);
                return (
                  <Link
                    key={item.peminjaman_id}
                    href={`/admin/listpeminjaman/${item.peminjaman_id}`}
                    className={styles.recentItem}
                  >
                    <div className={styles.recentInfo}>
                      <span className={styles.recentName}>
                        {item.nama_kegiatan || 'Tanpa nama kegiatan'}
                      </span>
                      <span className={styles.recentMeta}>
                        {item.room_id} - {formatLocalDateTime(item.tanggal_dimulai)}
                      </span>
                    </div>
                    <span className={`${styles.recentStatus} ${status.className}`}>
                      {status.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Aksi Cepat</h2>
          </div>
          <div className={styles.actionList}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className={styles.actionItem}>
                  <span className={styles.actionIcon}>
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <div className={styles.actionInfo}>
                    <div className={styles.actionTitleRow}>
                      <h3 className={styles.actionTitle}>{action.title}</h3>
                      {action.badge && (
                        <span className={styles.actionBadge}>{action.badge}</span>
                      )}
                    </div>
                    <p className={styles.actionDesc}>{action.description}</p>
                  </div>
                  <ChevronRight size={16} className={styles.actionArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytics Mini Chart */}
      <div className={styles.panel} style={{ maxWidth: 1000, margin: '16px auto 0' }}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Statistik Peminjaman</h2>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(86px, 1fr))', gap: 12 }}>
            <ChartBar label="Menunggu" count={pendingCount} total={pendingCount + approvedCount + rejectedCount} color="var(--amber-500)" />
            <ChartBar label="Disetujui" count={approvedCount} total={pendingCount + approvedCount + rejectedCount} color="var(--green-500)" />
            <ChartBar label="Ditolak" count={rejectedCount} total={pendingCount + approvedCount + rejectedCount} color="var(--red-500)" />
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--surface-raised)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)' }}>
              <span>Approval Rate</span>
              <span style={{ fontWeight: 700, color: 'var(--green-700)' }}>
                {(pendingCount + approvedCount + rejectedCount) > 0
                  ? Math.round((approvedCount / (pendingCount + approvedCount + rejectedCount)) * 100)
                  : 0}%
              </span>
            </div>
            <div style={{ marginTop: 6, height: 6, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                background: 'linear-gradient(90deg, var(--green-400), var(--green-600))',
                width: `${(pendingCount + approvedCount + rejectedCount) > 0 ? Math.round((approvedCount / (pendingCount + approvedCount + rejectedCount)) * 100) : 0}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{
          width: 32, borderRadius: '4px 4px 0 0',
          height: `${Math.max(pct, 8)}%`,
          background: color,
          transition: 'height 0.5s ease',
        }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{count}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{pct}%</div>
    </div>
  );
}
