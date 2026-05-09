"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, PlusSquare, ClipboardList } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
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
        <h2 className={styles.brandTitle}>Admin Panel</h2>
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
    </aside>
  );
}