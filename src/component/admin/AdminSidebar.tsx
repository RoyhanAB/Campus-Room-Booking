"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, ClipboardList, LogOut, GraduationCap, Users, Shield, Settings, Activity, Menu, X } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar({ userName, role }: { userName?: string; role?: string }) {
  const pathname = usePathname();
  const isSuperAdmin = role === 'super_admin';
  const [moreOpen, setMoreOpen] = useState(false);

  const baseNavItems = [
    { name: 'Home', path: '/admin', icon: Home },
    { name: 'Ruangan', path: '/admin/listruangan', icon: Building },
    { name: 'Peminjaman', path: '/admin/listpeminjaman', icon: ClipboardList },
  ];

  const superAdminNavItems = [
    { name: 'Home', path: '/admin', icon: Home },
    { name: 'Ruangan', path: '/admin/listruangan', icon: Building },
    { name: 'Peminjaman', path: '/admin/listpeminjaman', icon: ClipboardList },
    { name: 'Gedung', path: '/admin/kelola-gedung', icon: Building },
    { name: 'Fakultas', path: '/admin/kelola-fakultas', icon: GraduationCap },
    { name: 'Admin', path: '/admin/kelola-admin', icon: Shield },
    { name: 'User', path: '/admin/kelola-user', icon: Users },
    { name: 'Audit Log', path: '/admin/audit-log', icon: Activity },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = isSuperAdmin ? superAdminNavItems : baseNavItems;
  return (
    <aside className={`${styles.sidebar} ${isSuperAdmin ? styles.superSidebar : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandLogoWrap}>
          <Image
            src="/image/untr.png"
            alt="Logo UNTIRTA"
            width={24}
            height={24}
            className={styles.brandLogo}
          />
        </span>
        <div className={styles.brandTextWrap}>
          <span className={styles.brandTitle}>
            {isSuperAdmin ? 'Super Admin' : 'Admin Panel'}
          </span>
          <span className={styles.brandSubtitle}>UNTIRTA</span>
        </div>
        {isSuperAdmin && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMoreOpen(true)}
            aria-label="Buka menu super admin"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.activeItem : ''}`}
              onClick={() => setMoreOpen(false)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={styles.navIcon} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {isSuperAdmin && moreOpen && (
        <div className={styles.moreOverlay} onClick={() => setMoreOpen(false)}>
          <div className={styles.moreSheet} onClick={(event) => event.stopPropagation()}>
            <div className={styles.moreHeader}>
              <span>{isSuperAdmin ? 'Menu Super Admin' : 'Menu Admin'}</span>
              <button type="button" className={styles.moreClose} onClick={() => setMoreOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.moreList}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${styles.moreItem} ${isActive ? styles.activeItem : ''}`}
                    onClick={() => setMoreOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <form action={logoutAction}>
                <button type="submit" className={styles.moreItem}>
                  <LogOut size={18} />
                  <span>Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        {userName && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {isSuperAdmin ? <Shield size={14} /> : userName.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userNameText}>{userName}</span>
          </div>
        )}
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutItem}>
            <LogOut size={20} strokeWidth={2} className={styles.navIcon} />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
