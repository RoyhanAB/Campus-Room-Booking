"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, PlusSquare, ClipboardList, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/admin', icon: Home },
    { name: 'List Ruangan', path: '/admin/listruangan', icon: Building },
    { name: 'Tambah Ruangan', path: '/admin/tambahruangan', icon: PlusSquare },
    { name: 'List Peminjaman', path: '/admin/listpeminjaman', icon: ClipboardList },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandLogoWrap}>
          <Image
            src="/image/untr.png"
            alt="Logo UNTIRTA"
            width={26}
            height={26}
            className={styles.brandLogo}
          />
        </span>
        <div className={styles.brandTextWrap}>
          <span className={styles.brandTitle}>Admin Panel</span>
          <span className={styles.brandSubtitle}>UNTIRTA</span>
        </div>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));

        return (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${isActive ? styles.activeItem : ''}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={styles.navIcon} />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Spacer + Logout di bagian bawah sidebar */}
      <div className={styles.sidebarFooter}>
        {userName && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
            <span className={styles.userNameText}>{userName}</span>
          </div>
        )}
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutItem}>
            <LogOut size={22} strokeWidth={2} className={styles.navIcon} />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}