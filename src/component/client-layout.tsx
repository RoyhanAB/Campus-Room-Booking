'use client';

import Header from '@/component/user/header';
import Mobilenav from '@/component/user/mobilenav';

export function ClientLayout({ children, userName }: { children: React.ReactNode; userName?: string }) {
  return (
    <>
      <Header userName={userName} />
      <Mobilenav />
      {children}
    </>
  );
}
