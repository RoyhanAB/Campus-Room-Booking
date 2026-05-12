'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className={styles.wrapper}>
      <Link href="/landing" className={styles.backLink}>
        <ArrowLeft size={14} />
        Kembali ke beranda
      </Link>
      <div className={styles.card}>
        {/* Logo & Branding */}
        <div className={styles.brandSection}>
          <Image
            src="/image/untr.png"
            alt="Logo UNTIRTA"
            width={72}
            height={72}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Peminjaman Ruangan</h1>
          <p className={styles.subtitle}>Universitas Sultan Ageng Tirtayasa</p>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Form */}
        <form action={formAction} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="userId" className={styles.label}>
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              placeholder="Contoh: USR001 atau ADM001"
              className={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {state?.error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5" />
                <path d="M8 4.5v4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.75" fill="#dc2626" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={styles.submitBtn}
          >
            {isPending ? (
              <span className={styles.loadingContent}>
                <span className={styles.spinner}></span>
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className={styles.footerText}>
          Gunakan User ID dan Password yang telah terdaftar di sistem.
        </p>
      </div>
    </div>
  );
}
