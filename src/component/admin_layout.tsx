'use client';

import AdminSidebar from '@/component/admin/AdminSidebar';


export function AdminLayout({ children, userName, role }: { children: React.ReactNode; userName?: string; role?: string }) {
    const isSuperAdmin = role === 'super_admin';

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 44%, #ffffff 100%)' }}>
                <AdminSidebar userName={userName} role={role} />
                <main
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    className={`admin-content-wrapper ${isSuperAdmin ? 'super-admin-content' : 'regular-admin-content'}`}
                >
                    {children}
                </main>

                <style>{`
                    .regular-admin-content {
                        padding-bottom: 80px;
                    }
                    .super-admin-content {
                        padding-top: 58px;
                        padding-bottom: 24px;
                    }
                    @media (min-width: 768px) {
                    .admin-content-wrapper {
                        margin-left: 216px;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    }
                `}</style>
            </div>
        </>
    );
}
