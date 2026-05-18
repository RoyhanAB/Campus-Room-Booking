import { ClientLayout } from "@/component/client-layout";
import { getSession } from "@/lib/auth";
import { getSettingObject, getSystemSettings } from "@/lib/settings";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, settings] = await Promise.all([
    getSession(),
    getSystemSettings(),
  ]);

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'admin_fakultas' || session.role === 'super_admin') {
    redirect('/admin');
  }

  const maintenance = getSettingObject(settings, 'maintenance_mode', {
    active: false,
    message: 'Sistem sedang dalam perbaikan.',
  });

  if (Boolean(maintenance.active)) {
    return (
      <ClientLayout userName={session.user_name}>
        <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 20 }}>
          <section style={{
            width: '100%',
            maxWidth: 460,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 20, color: 'var(--ink)' }}>Mode Maintenance</h1>
            <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: 14, lineHeight: 1.6 }}>
              {String(maintenance.message || 'Sistem sedang dalam perbaikan.')}
            </p>
          </section>
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout userName={session.user_name}>
      {children}
    </ClientLayout>
  );
}
