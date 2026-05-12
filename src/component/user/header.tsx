"use client";
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import styles from './header.module.css';

export default function Header({ userName }: { userName?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'List Ruangan', path: '/listruangan' },
    { name: 'History', path: '/history' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.logoWrap}>
          <Image
            src="/image/untr.png"
            alt="Logo UNTIRTA"
            width={32}
            height={32}
            className={styles.logo}
            priority
          />
        </span>
        <span className={styles.titleWrap}>
          <span className={styles.title}>Peminjaman Ruangan</span>
          <span className={styles.subtitle}>UNTIRTA</span>
        </span>
      </Link>

      {/* Navigasi Desktop */}
      <nav className={styles.desktopNav}>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path}
            className={`${styles.navLink} ${pathname === item.path ? styles.activeLink : ''}`}
          >
            {item.name}
          </Link>
        ))}

        {/* User info + Logout */}
        <div className={styles.userSection}>
          {userName && (
            <span className={styles.userName}>{userName}</span>
          )}
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn} title="Logout">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}