import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  History,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import type { Metadata } from 'next';
import styles from './landing.module.css';

export const metadata: Metadata = {
  title: 'Peminjaman Ruangan UNTIRTA — Portal Resmi Kampus',
  description:
    'Sistem peminjaman ruangan Universitas Sultan Ageng Tirtayasa. Cek ketersediaan, ajukan, dan pantau status peminjaman secara online.',
};

const features = [
  {
    icon: LayoutGrid,
    title: 'Katalog Ruangan Lengkap',
    description:
      'Telusuri seluruh ruangan kampus beserta foto, kapasitas, lantai, dan fasilitas pendukungnya.',
  },
  {
    icon: CalendarCheck,
    title: 'Jadwal Real-Time',
    description:
      'Cek jadwal pemakaian ruangan langsung dari halaman detail agar tidak bentrok dengan kegiatan lain.',
  },
  {
    icon: ClipboardList,
    title: 'Form Pengajuan Cepat',
    description:
      'Ajukan peminjaman cukup dengan mengisi data kegiatan, tanggal, dan jumlah peserta dalam hitungan menit.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval Terstruktur',
    description:
      'Admin Fakultas dapat menyetujui atau menolak peminjaman dengan riwayat audit yang jelas.',
  },
  {
    icon: History,
    title: 'Riwayat Tersimpan',
    description:
      'Pantau status seluruh pengajuan: menunggu, disetujui, atau ditolak — semua dalam satu halaman riwayat.',
  },
  {
    icon: Sparkles,
    title: 'Antarmuka Modern',
    description:
      'Tampilan responsif yang nyaman digunakan dari laptop maupun perangkat mobile mahasiswa.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Masuk dengan akun kampus',
    description:
      'Gunakan User ID dan password yang telah diberikan oleh fakultas untuk masuk ke portal.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Pilih ruangan & jadwal',
    description:
      'Telusuri katalog ruangan, lihat ketersediaan jadwal, dan pilih ruangan yang paling sesuai.',
    icon: Building2,
  },
  {
    number: '03',
    title: 'Ajukan & pantau status',
    description:
      'Isi form peminjaman, lalu pantau status persetujuan di halaman riwayat secara real-time.',
    icon: CheckCircle2,
  },
];

const stats = [
  { value: '24/7', label: 'Akses pengajuan online' },
  { value: '100%', label: 'Riwayat tercatat rapi' },
  { value: '< 5 mnt', label: 'Waktu pengajuan rata-rata' },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <Link href="/landing" className={styles.brand}>
          <span className={styles.brandLogoWrap}>
            <Image
              src="/image/untr.png"
              alt="Logo UNTIRTA"
              width={36}
              height={36}
              className={styles.brandLogo}
              priority
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Peminjaman Ruangan</span>
            <span className={styles.brandSubtitle}>UNTIRTA</span>
          </span>
        </Link>
        <nav className={styles.navLinks}>
          <a href="#fitur" className={styles.navLink}>Fitur</a>
          <a href="#cara-kerja" className={styles.navLink}>Cara Kerja</a>
          <a href="#tentang" className={styles.navLink}>Tentang</a>
          <a href="#kontak" className={styles.navLink}>Kontak</a>
        </nav>
        <Link href="/login" className={styles.navCta}>
          Masuk
          <ArrowRight size={16} />
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBgOrb1} aria-hidden="true" />
        <div className={styles.heroBgOrb2} aria-hidden="true" />
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <Sparkles size={14} />
              Portal Resmi Kampus UNTIRTA
            </span>
            <h1 className={styles.heroTitle}>
              Pinjam ruangan kampus jadi <span className={styles.heroAccent}>lebih cepat</span> &amp; tertata.
            </h1>
            <p className={styles.heroSubtitle}>
              Satu portal untuk mahasiswa dan admin fakultas: cek ketersediaan ruangan,
              ajukan peminjaman, dan kelola persetujuan tanpa perlu surat manual.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/login" className={styles.ctaPrimary}>
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>
              <a href="#fitur" className={styles.ctaSecondary}>
                Pelajari Fitur
              </a>
            </div>

            <div className={styles.heroStats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDot} />
                <div className={styles.previewDot} />
                <div className={styles.previewDot} />
                <span className={styles.previewUrl}>untirta.app/listruangan</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewSearch}>
                  <span className={styles.previewSearchIcon}>🔍</span>
                  <span>Cari ruangan, gedung, atau fakultas...</span>
                </div>
                <div className={styles.previewList}>
                  {[
                    { name: 'Aula Utama', meta: 'Gedung Rektorat · Lt. 2', cap: '250', status: 'Tersedia' },
                    { name: 'Ruang Seminar A', meta: 'FT · Lt. 3', cap: '60', status: 'Tersedia' },
                    { name: 'Lab Komputer 4', meta: 'FT · Lt. 2', cap: '40', status: 'Terpakai' },
                  ].map((room) => (
                    <div key={room.name} className={styles.previewRoom}>
                      <div className={styles.previewRoomThumb}>
                        <Building2 size={20} />
                      </div>
                      <div className={styles.previewRoomInfo}>
                        <span className={styles.previewRoomName}>{room.name}</span>
                        <span className={styles.previewRoomMeta}>{room.meta}</span>
                      </div>
                      <div className={styles.previewRoomMetrics}>
                        <span className={styles.previewRoomCap}>
                          <Users size={12} /> {room.cap}
                        </span>
                        <span
                          className={`${styles.previewRoomStatus} ${
                            room.status === 'Tersedia' ? styles.statusOk : styles.statusBusy
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.floatingBadge}>
              <CheckCircle2 size={18} />
              <div>
                <span className={styles.floatingBadgeTitle}>Disetujui</span>
                <span className={styles.floatingBadgeText}>Aula Utama · 14:00</span>
              </div>
            </div>

            <div className={styles.floatingBadgeAlt}>
              <Clock size={18} />
              <div>
                <span className={styles.floatingBadgeTitle}>Menunggu</span>
                <span className={styles.floatingBadgeText}>Ruang Seminar A</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bookingPreview}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>Jadwal Terkini</span>
          <h2 className={styles.sectionTitle}>Ruangan yang sedang dibooking hari ini</h2>
          <p className={styles.sectionLead}>
            Lihat jadwal peminjaman ruangan yang telah disetujui untuk memastikan tidak ada bentrok waktu.
          </p>
        </div>

        <div className={styles.bookingGrid}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <Calendar size={20} className={styles.bookingIcon} />
              <span className={styles.bookingDate}>Senin, 12 Mei 2026</span>
            </div>
            <div className={styles.bookingList}>
              <div className={styles.bookingItem}>
                <div className={styles.bookingTime}>08:00 - 10:00</div>
                <div className={styles.bookingInfo}>
                  <span className={styles.bookingRoom}>Aula Utama</span>
                  <span className={styles.bookingEvent}>Seminar Nasional Teknologi</span>
                </div>
                <span className={styles.bookingBadge}>Disetujui</span>
              </div>
              <div className={styles.bookingItem}>
                <div className={styles.bookingTime}>13:00 - 15:00</div>
                <div className={styles.bookingInfo}>
                  <span className={styles.bookingRoom}>Ruang Seminar A</span>
                  <span className={styles.bookingEvent}>Workshop Desain Grafis</span>
                </div>
                <span className={styles.bookingBadge}>Disetujui</span>
              </div>
              <div className={styles.bookingItem}>
                <div className={styles.bookingTime}>15:30 - 17:00</div>
                <div className={styles.bookingInfo}>
                  <span className={styles.bookingRoom}>Lab Komputer 4</span>
                  <span className={styles.bookingEvent}>Praktikum Pemrograman Web</span>
                </div>
                <span className={styles.bookingBadge}>Disetujui</span>
              </div>
            </div>
          </div>

          <div className={styles.calendarNote}>
            <div className={styles.calendarNoteIcon}>
              <CalendarCheck size={32} />
            </div>
            <h3 className={styles.calendarNoteTitle}>Cek Jadwal Lengkap</h3>
            <p className={styles.calendarNoteText}>
              Masuk ke portal untuk melihat jadwal lengkap semua ruangan dan ketersediaannya secara real-time.
            </p>
            <Link href="/login" className={styles.calendarNoteBtn}>
              Lihat Jadwal Lengkap
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="fitur" className={styles.features}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>Fitur</span>
          <h2 className={styles.sectionTitle}>Semua yang dibutuhkan kampus, dalam satu portal.</h2>
          <p className={styles.sectionLead}>
            Dirancang khusus untuk alur peminjaman ruangan di lingkungan UNTIRTA — sederhana
            untuk mahasiswa, terkontrol untuk admin fakultas.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIconWrap}>
                  <Icon size={22} />
                </span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="cara-kerja" className={styles.steps}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>Cara Kerja</span>
          <h2 className={styles.sectionTitle}>Tiga langkah, ruangan siap dipakai.</h2>
          <p className={styles.sectionLead}>
            Tidak perlu antre di sekretariat fakultas. Cukup ikuti tiga langkah sederhana berikut.
          </p>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <span className={styles.stepIconWrap}>
                  <Icon size={20} />
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="tentang" className={styles.about}>
        <div className={styles.aboutCard}>
          <div className={styles.aboutContent}>
            <span className={styles.sectionTag}>Tentang</span>
            <h2 className={styles.aboutTitle}>
              Dibangun untuk mendukung kegiatan akademik &amp; kemahasiswaan UNTIRTA.
            </h2>
            <p className={styles.aboutText}>
              Aplikasi ini menjadi jembatan antara mahasiswa peminjam dan admin fakultas
              sebagai pengelola ruangan. Setiap peminjaman dicatat, dapat dilacak, dan tidak
              lagi bergantung pada surat fisik atau pesan singkat yang mudah hilang.
            </p>
            <ul className={styles.aboutList}>
              <li>
                <CheckCircle2 size={18} /> Role terpisah untuk Mahasiswa &amp; Admin Fakultas.
              </li>
              <li>
                <CheckCircle2 size={18} /> Data ruangan, jadwal, dan peminjaman tersentralisasi.
              </li>
              <li>
                <CheckCircle2 size={18} /> Riwayat &amp; status peminjaman selalu transparan.
              </li>
            </ul>
          </div>

          <div className={styles.aboutVisual} aria-hidden="true">
            <div className={styles.aboutLogoWrap}>
              <Image
                src="/image/untr.png"
                alt="Logo UNTIRTA"
                width={120}
                height={120}
                className={styles.aboutLogo}
              />
            </div>
            <p className={styles.aboutSig}>Universitas Sultan Ageng Tirtayasa</p>
          </div>
        </div>
      </section>

      <section id="kontak" className={styles.contact}>
        <div className={styles.contactCard}>
          <div className={styles.contactHeader}>
            <span className={styles.sectionTag}>Kontak</span>
            <h2 className={styles.contactTitle}>Butuh bantuan? Hubungi kami</h2>
            <p className={styles.contactSubtitle}>
              Tim admin siap membantu Anda dengan pertanyaan seputar peminjaman ruangan kampus.
            </p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <Mail size={24} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:3337230021@untirta.ac.id" className={styles.contactValue}>
                  3337230021@untirta.ac.id
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <Phone size={24} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>WhatsApp</span>
                <a 
                  href="https://wa.me/6287862741301" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.contactValue}
                >
                  087862741301
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <MapPin size={24} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Alamat</span>
                <a 
                  href="https://maps.google.com/?q=Jl.+Nasional+III+No.3,+Kotabumi,+Kec.+Purwakarta,+Kota+Cilegon,+Banten+42434"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactValue}
                >
                  Jl. Nasional III No.3, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Siap meminjam ruangan kampus?</h2>
          <p className={styles.ctaText}>
            Masuk dengan akun yang telah terdaftar untuk mulai mengajukan peminjaman atau
            mengelola persetujuan.
          </p>
          <Link href="/login" className={styles.ctaPrimary}>
            Masuk ke Portal
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image
              src="/image/untr.png"
              alt="Logo UNTIRTA"
              width={32}
              height={32}
              className={styles.footerLogo}
            />
            <div>
              <span className={styles.footerTitle}>Peminjaman Ruangan UNTIRTA</span>
              <span className={styles.footerSubtitle}>
                Universitas Sultan Ageng Tirtayasa
              </span>
            </div>
          </div>
          <p className={styles.footerNote}>
            © {new Date().getFullYear()} UNTIRTA. Portal internal kampus untuk pengelolaan
            peminjaman ruangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
