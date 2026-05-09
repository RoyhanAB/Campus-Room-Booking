"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ClipboardList, User } from 'lucide-react';
import styles from './mobilenav.module.css';

export default function Mobilenav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Rooms', path: '/listruangan', icon: Calendar }, 
    { name: 'History', path: '/history', icon: ClipboardList },
    { name: 'Profile', path: '/profile', icon: User },
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
    </nav>
  );
}