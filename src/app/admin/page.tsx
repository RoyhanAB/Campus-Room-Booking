import Link from 'next/link';
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  PlusSquare,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import styles from './HomeAdmin.module.css';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { getSession } from '@/lib/auth';
import { getRecentPeminjaman } from '@/lib/peminjaman';
import { supabase } from '@/lib/supabase';
import type { Peminjaman } from '@/types/peminjaman';

export const revalidate = 0;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

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

async function safeCountFrom(table: string, filter?: { column: string; value: string }) {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) query = query.eq(filter.column, filter.value);
    const { count } = await query;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function safeRecentPeminjaman(): Promise<Peminjaman[]> {
  try {
    return await getRecentPeminjaman(5);
  } catch {
    return [];
  }
}

export default async function AdminHomePage() {
  const session = await getSession();
  const currentUserId = session?.user_id || '';

  const [adminInfo, totalRooms, pendingCount, approvedCount, rejectedCount, recent] = await Promise.all([
    getAdminInfo(currentUserId),
    safeCountFrom('rooms'),
    safeCountFrom('peminjaman', { column: 'status', value: 'menunggu' }),
    safeCountFrom('peminjaman', { column: 'status', value: 'disetujui' }),
    safeCountFrom('peminjaman', { column: 'status', value: 'ditolak' }),
    safeRecentPeminjaman(),
  ]);

  const userName = adminInfo?.user?.user_name || session?.user_name || 'Admin';
  const facultyName = adminInfo?.fakultas?.fakultas_name || 'Fakultas Tidak Diketahui';

  const stats = [
    {
      label: 'Total Ruangan',
      value: totalRooms,
      icon: Building,
      iconClass: styles.statIconYellow,
      trend: '+2 bulan ini',
    },
    {
      label: 'Menunggu Persetujuan',
      value: pendingCount,
      icon: Clock,
      iconClass: styles.statIconBlue,
      trend: 'Perlu ditinjau',
    },
    {
      label: 'Disetujui',
      value: approvedCount,
      icon: CheckCircle2,
      iconClass: styles.statIconGreen,
      trend: 'Bulan ini',
    },
    {
      label: 'Ditolak',
      value: rejectedCount,
      icon: XCircle,
      iconClass: styles.statIconRed,
      trend: 'Bulan ini',
    },
  ];

  const quickActions = [
    {
      href: '/admin/listpeminjaman',
      title: 'Kelola Peminjaman',
      description: 'Tinjau dan setujui pengajuan dari mahasiswa.',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} baru` : null,
    },
    {
      href: '/admin/tambahruangan',
      title: 'Tambah Ruangan Baru',
      description: 'Daftarkan ruangan baru beserta fasilitasnya.',
      icon: PlusSquare,
      badge: null,
    },
    {
      href: '/admin/listruangan',
      title: 'Atur Daftar Ruangan',
      description: 'Edit atau hapus ruangan yang sudah terdaftar.',
      icon: Building,
      badge: null,
    },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>
            <Sparkles size={14} />
            Admin Fakultas UNTIRTA
          </span>
          <p className={styles.welcomeText}>
            Selamat datang, <strong>{userName}</strong>
          </p>
          <h1 className={styles.facultyName}>{facultyName}</h1>
          <p className={styles.heroSubtitle}>
            Kelola katalog ruangan dan setujui peminjaman dari mahasiswa pada satu dashboard.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/admin/listpeminjaman" className={styles.ctaPrimary}>
              Lihat Peminjaman
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin/tambahruangan" className={styles.ctaSecondary}>
              Tambah Ruangan
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={`${styles.statIcon} ${stat.iconClass}`}>
                  <Icon size={20} />
                </span>
                <TrendingUp size={14} className={styles.trendIcon} />
              </div>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statTrend}>{stat.trend}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.panelGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <ClipboardList size={18} /> Peminjaman Terbaru
            </h2>
            <Link href="/admin/listpeminjaman" className={styles.panelLink}>
              Lihat semua <ChevronRight size={14} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className={styles.emptyState}>
              <ClipboardList size={20} />
              Belum ada pengajuan peminjaman.
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
                    <span className={styles.recentIcon}>
                      <ClipboardList size={18} />
                    </span>
                    <div className={styles.recentInfo}>
                      <span className={styles.recentName}>
                        {item.nama_kegiatan || 'Tanpa nama kegiatan'}
                      </span>
                      <span className={styles.recentMeta}>
                        {item.room_id} · {formatDateTime(item.tanggal_dimulai)}
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

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <Sparkles size={18} /> Aksi Cepat
            </h2>
          </div>
          <div className={styles.actionList}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className={styles.actionItem}>
                  <span className={styles.actionIcon}>
                    <Icon size={20} />
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
                  <ChevronRight size={18} className={styles.actionArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
