import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  History,
  LayoutGrid,
  ShieldCheck,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
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
    title: 'Katalog Ruangan',
    description: 'Telusuri seluruh ruangan kampus beserta foto, kapasitas, dan fasilitas pendukung.',
  },
  {
    icon: CalendarCheck,
    title: 'Jadwal Real-Time',
    description: 'Cek jadwal pemakaian ruangan langsung agar tidak bentrok dengan kegiatan lain.',
  },
  {
    icon: ClipboardList,
    title: 'Pengajuan Cepat',
    description: 'Ajukan peminjaman cukup dengan mengisi data kegiatan dalam hitungan menit.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval Terstruktur',
    description: 'Admin fakultas menyetujui atau menolak dengan riwayat audit yang jelas.',
  },
  {
    icon: History,
    title: 'Riwayat Tersimpan',
    description: 'Pantau seluruh pengajuan: menunggu, disetujui, atau ditolak di satu halaman.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Tampilan terpisah untuk mahasiswa dan admin fakultas sesuai kebutuhan.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Login ke Portal',
    description: 'Gunakan User ID dan password yang telah diberikan oleh fakultas.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Pilih Ruangan',
    description: 'Telusuri katalog, lihat jadwal ketersediaan, dan pilih ruangan yang sesuai.',
    icon: Building2,
  },
  {
    number: '03',
    title: 'Ajukan & Pantau',
    description: 'Isi form peminjaman, lalu pantau status persetujuan secara real-time.',
    icon: CheckCircle2,
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/landing" className={styles.brand}>
            <span className={styles.brandLogoWrap}>
              <Image src="/image/untr.png" alt="Logo UNTIRTA" width={36} height={36} className={styles.brandLogo} priority />
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandTitle}>Peminjaman Ruangan</span>
              <span className={styles.brandSubtitle}>UNTIRTA</span>
            </span>
          </Link>
          <nav className={styles.navLinks}>
            <a href="#fitur" className={styles.navLink}>Fitur</a>
            <a href="#cara-kerja" className={styles.navLink}>Cara Kerja</a>
            <a href="#galeri" className={styles.navLink}>Galeri</a>
            <a href="#kontak" className={styles.navLink}>Kontak</a>
          </nav>
          <Link href="/login" className={styles.navCta}>
            Masuk <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero with Campus Background */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/image/gedung rektorat.webp"
            alt="Gedung Rektorat UNTIRTA"
            fill
            className={styles.heroBgImage}
            priority
            quality={85}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Portal Resmi Kampus UNTIRTA
            </div>
            <h1 className={styles.heroTitle}>
              Peminjaman Ruangan Kampus,{' '}
              <span className={styles.heroAccent}>Lebih Cepat & Tertata.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Satu portal untuk mahasiswa dan admin fakultas — cek ketersediaan ruangan,
              ajukan peminjaman, dan kelola persetujuan tanpa perlu surat manual.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/login" className={styles.ctaPrimary}>
                Mulai Sekarang <ArrowRight size={17} />
              </Link>
              <a href="#fitur" className={styles.ctaSecondary}>
                Pelajari Fitur <ChevronDown size={16} />
              </a>
            </div>
          </div>

          {/* Floating Stats Cards */}
          <div className={styles.heroFloats}>
            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <div className={styles.floatIconWrap}><CalendarCheck size={20} /></div>
              <div>
                <span className={styles.floatValue}>24/7</span>
                <span className={styles.floatLabel}>Akses Online</span>
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <div className={styles.floatIconWrap}><Clock size={20} /></div>
              <div>
                <span className={styles.floatValue}>&lt; 5 mnt</span>
                <span className={styles.floatLabel}>Waktu Pengajuan</span>
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard3}`}>
              <div className={styles.floatIconWrap}><CheckCircle2 size={20} /></div>
              <div>
                <span className={styles.floatValue}>100%</span>
                <span className={styles.floatLabel}>Riwayat Tercatat</span>
              </div>
            </div>
          </div>
        </div>
        <a href="#fitur" className={styles.scrollIndicator}>
          <ChevronDown size={20} />
        </a>
      </section>

      {/* Features */}
      <section id="fitur" className={styles.features}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Fitur Unggulan</span>
            <h2 className={styles.sectionTitle}>
              Semua yang dibutuhkan kampus,<br className={styles.brDesktop} /> dalam satu portal.
            </h2>
            <p className={styles.sectionLead}>
              Dirancang khusus untuk alur peminjaman ruangan di lingkungan UNTIRTA.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className={styles.featureCard} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={styles.featureIconWrap}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.description}</p>
                  <div className={styles.featureShine} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="cara-kerja" className={styles.steps}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Cara Kerja</span>
            <h2 className={styles.sectionTitle}>Tiga langkah mudah, ruangan siap dipakai.</h2>
            <p className={styles.sectionLead}>
              Tidak perlu antre di sekretariat. Cukup ikuti langkah berikut.
            </p>
          </div>
          <div className={styles.stepGrid}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={styles.stepCard} style={{ animationDelay: `${i * 120}ms` }}>
                  <div className={styles.stepNumberBig}>{step.number}</div>
                  <div className={styles.stepIconWrap}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              );
            })}
            <div className={styles.stepConnectorLine} />
          </div>
        </div>
      </section>

      {/* Gallery / Campus Section */}
      <section id="galeri" className={styles.gallery}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Kampus Kami</span>
            <h2 className={styles.sectionTitle}>Fasilitas Kampus UNTIRTA</h2>
            <p className={styles.sectionLead}>
              Berbagai gedung dan ruangan yang tersedia untuk kegiatan akademik & kemahasiswaan.
            </p>
          </div>
          <div className={styles.galleryGrid}>
            <div className={`${styles.galleryItem} ${styles.galleryMain}`}>
              <Image src="/image/gedung rektorat.webp" alt="Gedung Rektorat UNTIRTA" fill className={styles.galleryImage} quality={80} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryLabel}>Gedung Rektorat</span>
                <span className={styles.galleryCaption}>Pusat administrasi kampus</span>
              </div>
            </div>
            <div className={styles.galleryItem}>
              <Image src="/image/ft.jpg" alt="Fakultas Teknik UNTIRTA" fill className={styles.galleryImage} quality={80} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryLabel}>Fakultas Teknik</span>
                <span className={styles.galleryCaption}>Gedung perkuliahan & lab</span>
              </div>
            </div>
            <div className={styles.galleryItem}>
              <Image src="/image/untirta.webp" alt="Kampus UNTIRTA" fill className={styles.galleryImage} quality={80} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryLabel}>Area Kampus</span>
                <span className={styles.galleryCaption}>Lingkungan kampus yang asri</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.about}>
        <div className={styles.sectionInner}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <span className={styles.sectionTag}>Tentang</span>
              <h2 className={styles.aboutTitle}>
                Mendukung kegiatan akademik & kemahasiswaan UNTIRTA.
              </h2>
              <p className={styles.aboutText}>
                Aplikasi ini menjadi jembatan antara mahasiswa peminjam dan admin fakultas
                sebagai pengelola ruangan. Setiap peminjaman dicatat, dapat dilacak, dan tidak
                lagi bergantung pada surat fisik.
              </p>
              <ul className={styles.aboutList}>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /><span>Role terpisah untuk Mahasiswa & Admin Fakultas</span></li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /><span>Data ruangan, jadwal, dan peminjaman tersentralisasi</span></li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /><span>Riwayat & status peminjaman selalu transparan</span></li>
              </ul>
              <Link href="/login" className={styles.aboutCta}>
                Masuk ke Portal <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.aboutVisual}>
              <div className={styles.aboutImageWrap}>
                <Image src="/image/untirta.webp" alt="Kampus UNTIRTA" fill className={styles.aboutImage} quality={80} />
              </div>
              <div className={styles.aboutLogoFloat}>
                <Image src="/image/untr.png" alt="Logo UNTIRTA" width={48} height={48} />
                <span>Universitas Sultan Ageng Tirtayasa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontak" className={styles.contact}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Kontak</span>
            <h2 className={styles.sectionTitle}>Butuh bantuan?</h2>
            <p className={styles.sectionLead}>Tim admin siap membantu dengan pertanyaan seputar peminjaman ruangan.</p>
          </div>
          <div className={styles.contactGrid}>
            <a href="mailto:3337230021@untirta.ac.id" className={styles.contactCard}>
              <div className={styles.contactIconWrap}><Mail size={22} /></div>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>3337230021@untirta.ac.id</span>
            </a>
            <a href="https://wa.me/6287862741301" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.contactIconWrap}><Phone size={22} /></div>
              <span className={styles.contactLabel}>WhatsApp</span>
              <span className={styles.contactValue}>087862741301</span>
            </a>
            <a href="https://maps.google.com/?q=Jl.+Nasional+III+No.3,+Kotabumi,+Kec.+Purwakarta,+Kota+Cilegon,+Banten+42434" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.contactIconWrap}><MapPin size={22} /></div>
              <span className={styles.contactLabel}>Alamat</span>
              <span className={styles.contactValue}>Jl. Nasional III No.3, Cilegon</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaSectionBg}>
          <Image src="/image/ft.jpg" alt="Kampus UNTIRTA" fill className={styles.ctaSectionBgImg} quality={75} />
          <div className={styles.ctaSectionOverlay} />
        </div>
        <div className={styles.ctaSectionContent}>
          <h2 className={styles.ctaSectionTitle}>Siap meminjam ruangan kampus?</h2>
          <p className={styles.ctaSectionText}>
            Masuk dengan akun yang telah terdaftar untuk mulai mengajukan peminjaman.
          </p>
          <Link href="/login" className={styles.ctaPrimary}>
            Masuk ke Portal <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/image/untr.png" alt="Logo UNTIRTA" width={28} height={28} className={styles.footerLogo} />
            <div>
              <span className={styles.footerTitle}>Peminjaman Ruangan UNTIRTA</span>
              <span className={styles.footerSubtitle}>Universitas Sultan Ageng Tirtayasa</span>
            </div>
          </div>
          <p className={styles.footerNote}>© {new Date().getFullYear()} UNTIRTA. Portal internal kampus.</p>
        </div>
      </footer>
    </div>
  );
}
