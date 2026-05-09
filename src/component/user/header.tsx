"use client";
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.css';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'List Ruangan', path: '/listruangan' },
    { name: 'History', path: '/history' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {/* Ganti src dengan path logo kampus/institusi Anda */}
        <Image 
        src="/image/untr.png" 
        alt="Logo"
        width={40} 
        height={40}  
        className={styles.logo} />
        <h1 className={styles.title}>Peminjaman Ruangan</h1>
      </div>

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
      </nav>
    </header>
  );
}