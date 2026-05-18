'use client';

import Header from '@/component/user/header';

export function ClientLayout({ children, userName }: { children: React.ReactNode; userName?: string }) {
  return (
    <>
      <Header userName={userName} />
      {children}
    </>
  );
}
