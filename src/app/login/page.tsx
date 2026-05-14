'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Building2, ShieldCheck, Clock, CalendarCheck } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className={styles.wrapper}>
      {/* Background Image */}
      <div className={styles.bgWrap}>
        <Image
          src="/image/gedung rektorat.webp"
          alt="Kampus UNTIRTA"
          fill
          className={styles.bgImage}
          priority
          quality={80}
        />
        <div className={styles.bgOverlay} />
      </div>

      <Link href="/landing" className={styles.backLink}>
        <ArrowLeft size={14} />
        Kembali
      </Link>

      <div className={styles.layout}>
        {/* Left Side — Branding */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <div className={styles.brandLogoCard}>
              <Image src="/image/untr.png" alt="Logo UNTIRTA" width={56} height={56} className={styles.brandLogo} priority />
            </div>
            <h2 className={styles.brandTitle}>Peminjaman Ruangan</h2>
            <p className={styles.brandSubtitle}>Universitas Sultan Ageng Tirtayasa</p>
            
            <div className={styles.brandDivider} />

            <div className={styles.brandFeatures}>
              <div className={styles.brandFeature}>
                <div className={styles.brandFeatureIcon}><Building2 size={16} /></div>
                <span>Katalog ruangan lengkap</span>
              </div>
              <div className={styles.brandFeature}>
                <div className={styles.brandFeatureIcon}><ShieldCheck size={16} /></div>
                <span>Approval terstruktur</span>
              </div>
              <div className={styles.brandFeature}>
                <div className={styles.brandFeatureIcon}><Clock size={16} /></div>
                <span>Jadwal real-time</span>
              </div>
              <div className={styles.brandFeature}>
                <div className={styles.brandFeatureIcon}><CalendarCheck size={16} /></div>
                <span>Akses 24/7 online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className={styles.formSide}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardLogoMobile}>
                <Image src="/image/untr.png" alt="Logo UNTIRTA" width={40} height={40} />
              </div>
              <h1 className={styles.title}>Masuk ke Portal</h1>
              <p className={styles.subtitle}>Gunakan User ID dan Password yang telah terdaftar.</p>
            </div>

            <form action={formAction} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="userId" className={styles.label}>User ID</label>
                <input id="userId" name="userId" type="text" placeholder="Contoh: USR001 atau ADM001" className={styles.input} required autoComplete="username" />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input id="password" name="password" type="password" placeholder="Masukkan password" className={styles.input} required autoComplete="current-password" />
              </div>

              {state?.error && (
                <div className={styles.errorBox}>
                  <AlertCircle size={15} />
                  <span>{state.error}</span>
                </div>
              )}

              <button type="submit" disabled={isPending} className={styles.submitBtn}>
                {isPending ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner} />
                    Memproses...
                  </span>
                ) : 'Masuk'}
              </button>
            </form>

            <p className={styles.cardFooter}>
              Portal resmi kampus UNTIRTA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
