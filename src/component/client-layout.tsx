'use client';

import Header from '@/component/user/header';
import Mobilenav from '@/component/user/mobilenav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Mobilenav />
      {children}
    </>
  );
}
