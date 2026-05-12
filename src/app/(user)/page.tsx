import Link from 'next/link';
import {
  ArrowRight,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  History,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { getSession } from '@/lib/auth';
import styles from './home.module.css';

export const revalidate = 0;

export default async function Home() {
  const session = await getSession();
  const userName = session?.user_name;
  const currentHour = new Date().getHours();
  
  let greeting = 'Selamat pagi';
  if (currentHour >= 11 && currentHour < 15) greeting = 'Selamat siang';
  else if (currentHour >= 15 && currentHour < 18) greeting = 'Selamat sore';
  else if (currentHour >= 18) greeting = 'Selamat malam';

  return (
    <section className={styles.page}>
      {/* Hero dengan desain lebih dinamis */}
      <div className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            {userName && (
              <p className={styles.greeting}>
                {greeting}, <span className={styles.userName}>{userName}</span>
              </p>
            )}
            <h1 className={styles.title}>
              Booking Ruangan<br />
              <span className={styles.titleAccent}>Jadi Lebih Mudah</span>
            </h1>
            <p className={styles.subtitle}>
              Sistem peminjaman ruangan kampus yang praktis. Cek jadwal real-time, 
              ajukan booking, dan pantau status persetujuan dalam satu platform.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/listruangan" className={styles.btnPrimary}>
                <Building size={18} />
                Cari Ruangan
              </Link>
              <Link href="/formpeminjaman" className={styles.btnSecondary}>
                Ajukan Booking
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <div className={styles.cardHeader}>
                <MapPin size={16} />
                <span>Ruang Seminar A</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardStat}>
                  <Clock size={14} />
                  <span>Tersedia</span>
                </div>
                <div className={styles.cardStat}>
                  <TrendingUp size={14} />
                  <span>Kapasitas 60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions dengan layout baru */}
      <div className={styles.actionsSection}>
        <Link href="/listruangan" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Building size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Daftar Ruangan</h3>
            <p>Lihat semua ruangan yang tersedia beserta fasilitasnya</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={20} />
        </Link>

        <Link href="/formpeminjaman" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Buat Pengajuan</h3>
            <p>Ajukan peminjaman ruangan untuk kegiatan Anda</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={20} />
        </Link>

        <Link href="/history" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <History size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Riwayat Booking</h3>
            <p>Pantau status pengajuan peminjaman Anda</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={20} />
        </Link>
      </div>

      {/* Info Section dengan desain card yang lebih menarik */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <Sparkles size={20} />
            <h3>Tips Booking</h3>
          </div>
          <ul className={styles.tipsList}>
            <li>
              <CheckCircle size={16} />
              <span>Cek jadwal ruangan sebelum mengajukan untuk menghindari bentrok</span>
            </li>
            <li>
              <CheckCircle size={16} />
              <span>Pastikan jumlah peserta sesuai dengan kapasitas ruangan</span>
            </li>
            <li>
              <CheckCircle size={16} />
              <span>Siapkan dokumen pendukung seperti surat permohonan atau proposal</span>
            </li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <Calendar size={20} />
            <h3>Proses Persetujuan</h3>
          </div>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Submit Pengajuan</h4>
                <p>Isi form dan kirim pengajuan peminjaman</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Review Admin</h4>
                <p>Admin fakultas akan meninjau pengajuan Anda</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Konfirmasi</h4>
                <p>Dapatkan notifikasi hasil persetujuan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
