import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  History,
  Zap,
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
      {/* Hero with campus BG */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/image/gedung rektorat.webp" alt="Kampus UNTIRTA" fill className={styles.heroBgImg} quality={75} />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            {userName && (
              <p className={styles.greeting}>
                {greeting}, <span className={styles.userName}>{userName}</span> 👋
              </p>
            )}
            <h1 className={styles.title}>
              Booking Ruangan<br />
              <span className={styles.titleAccent}>Jadi Lebih Mudah</span>
            </h1>
            <p className={styles.subtitle}>
              Cek jadwal real-time, ajukan booking, dan pantau status 
              persetujuan dalam satu platform.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/listruangan" className={styles.btnPrimary}>
                <Building size={16} />
                Cari Ruangan
              </Link>
              <Link href="/formpeminjaman" className={styles.btnSecondary}>
                Ajukan Booking
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <Link href="/listruangan" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Building size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Daftar Ruangan</h3>
            <p>Lihat semua ruangan yang tersedia beserta fasilitasnya</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={18} />
        </Link>

        <Link href="/formpeminjaman" className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.actionIconBlue}`}>
            <FileText size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Buat Pengajuan</h3>
            <p>Ajukan peminjaman ruangan untuk kegiatan Anda</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={18} />
        </Link>

        <Link href="/history" className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.actionIconGreen}`}>
            <History size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Riwayat Booking</h3>
            <p>Pantau status pengajuan peminjaman Anda</p>
          </div>
          <ArrowRight className={styles.actionArrow} size={18} />
        </Link>
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <div className={styles.infoIconWrap}><Zap size={18} /></div>
            <h3>Tips Booking</h3>
          </div>
          <ul className={styles.tipsList}>
            <li>
              <span className={styles.tipNumber}>1</span>
              <span>Cek jadwal ruangan sebelum mengajukan untuk menghindari bentrok</span>
            </li>
            <li>
              <span className={styles.tipNumber}>2</span>
              <span>Pastikan jumlah peserta sesuai dengan kapasitas ruangan</span>
            </li>
            <li>
              <span className={styles.tipNumber}>3</span>
              <span>Siapkan dokumen pendukung seperti surat permohonan</span>
            </li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <div className={styles.infoIconWrap}><Calendar size={18} /></div>
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
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Review Admin</h4>
                <p>Admin fakultas akan meninjau pengajuan</p>
              </div>
            </div>
            <div className={styles.stepConnector} />
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
