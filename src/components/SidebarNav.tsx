'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SidebarNav.module.css';

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Travel Advisor', path: '/travel' },
    { name: 'Emergency Kit', path: '/kit' },
    { name: 'Safety Inspection', path: '/inspection' },
    { name: 'Nearby Services', path: '/services' }
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>NimbusAI</h2>
      <nav className={styles.navLinks}>
        {navItems.map(item => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
