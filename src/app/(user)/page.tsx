import Link from 'next/link';
import {
  ArrowRight,
  Building,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  History,
  Info,
  Sparkles,
} from 'lucide-react';
import { getSession } from '@/lib/auth';
import styles from './home.module.css';

export const revalidate = 0;

const quickActions = [
  {
    href: '/listruangan',
    title: 'Lihat Ruangan',
    description: 'Telusuri ruangan kampus beserta kapasitas dan fasilitasnya.',
    icon: Building,
    cta: 'Buka katalog',
  },
  {
    href: '/formpeminjaman',
    title: 'Ajukan Peminjaman',
    description: 'Isi form peminjaman untuk kegiatan akademik atau kemahasiswaan.',
    icon: ClipboardList,
    cta: 'Mulai pengajuan',
  },
  {
    href: '/history',
    title: 'Riwayat Peminjaman',
    description: 'Pantau status pengajuan yang sedang menunggu, disetujui, atau ditolak.',
    icon: History,
    cta: 'Lihat riwayat',
  },
];

export default async function Home() {
  const session = await getSession();
  const userName = session?.user_name;

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>
            <Sparkles size={14} />
            Portal Mahasiswa UNTIRTA
          </span>
          {userName && (
            <p className={styles.heroGreeting}>
              Halo, <strong style={{ color: '#fde68a' }}>{userName}</strong> 👋
            </p>
          )}
          <h1 className={styles.heroTitle}>
            Pinjam ruangan kampus, <span className={styles.heroAccent}>cepat &amp; tertata.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Cek ketersediaan ruangan, ajukan peminjaman, dan pantau status persetujuan
            tanpa perlu surat manual.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/listruangan" className={styles.ctaPrimary}>
              Lihat Ruangan
              <ArrowRight size={16} />
            </Link>
            <Link href="/formpeminjaman" className={styles.ctaSecondary}>
              Ajukan Peminjaman
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.quickGrid}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className={styles.quickCard}>
              <span className={styles.quickIcon}>
                <Icon size={22} />
              </span>
              <h2 className={styles.quickTitle}>{action.title}</h2>
              <p className={styles.quickDesc}>{action.description}</p>
              <span className={styles.quickArrow}>
                {action.cta} <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className={styles.infoGrid}>
        <article className={styles.infoCard}>
          <h2 className={styles.infoTitle}>
            <Info size={18} /> Panduan Peminjaman
          </h2>
          <ul className={styles.infoList}>
            <li>
              <CheckCircle2 size={16} />
              Pastikan data kegiatan, waktu, dan jumlah peserta sesuai sebelum mengirim.
            </li>
            <li>
              <CheckCircle2 size={16} />
              Cek jadwal ruangan di halaman detail agar tidak bentrok dengan kegiatan lain.
            </li>
            <li>
              <CheckCircle2 size={16} />
              Status pengajuan dapat dipantau langsung di halaman riwayat.
            </li>
          </ul>
        </article>

        <article className={styles.infoCard}>
          <h2 className={styles.infoTitle}>
            <CalendarCheck size={18} /> Dokumen yang Disarankan
          </h2>
          <ul className={styles.infoList}>
            <li>
              <CheckCircle2 size={16} />
              Surat permohonan resmi dari organisasi / dosen pembimbing.
            </li>
            <li>
              <CheckCircle2 size={16} />
              Proposal kegiatan (opsional, sesuai kebijakan fakultas).
            </li>
            <li>
              <CheckCircle2 size={16} />
              Daftar peserta jika kegiatan melibatkan banyak orang.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
