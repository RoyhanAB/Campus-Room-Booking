"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Home, Building, History } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import styles from './header.module.css';

export default function Header({ userName }: { userName?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Ruangan', path: '/listruangan', icon: Building },
    { name: 'Riwayat', path: '/history', icon: History },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logoWrap}>
            <Image
              src="/image/untr.png"
              alt="Logo UNTIRTA"
              width={28}
              height={28}
              className={styles.logo}
              priority
            />
          </span>
          <span className={styles.titleWrap}>
            <span className={styles.title}>Peminjaman Ruangan</span>
            <span className={styles.subtitle}>UNTIRTA</span>
          </span>
        </Link>

        <nav className={styles.desktopNav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className={styles.userSection}>
            {userName && (
              <span className={styles.userName}>{userName}</span>
            )}
            <form action={logoutAction}>
              <button type="submit" className={styles.logoutBtn} title="Logout">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <form action={logoutAction} className={styles.mobileLogoutForm}>
          <button type="submit" className={styles.mobileNavItem}>
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </form>
      </nav>
    </>
  );
}
