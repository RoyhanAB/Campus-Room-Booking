"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ClipboardList, User, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import styles from './mobilenav.module.css';

export default function Mobilenav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Rooms', path: '/listruangan', icon: Calendar }, 
    { name: 'History', path: '/history', icon: ClipboardList },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link 
            key={item.name} 
            href={item.path} 
            className={`${styles.navItem} ${isActive ? styles.activeItem : ''}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Logout button */}
      <form action={logoutAction}>
        <button type="submit" className={styles.navItem}>
          <LogOut size={24} strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </form>
    </nav>
  );
}