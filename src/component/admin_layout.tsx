'use client';

import AdminSidebar from '@/component/admin/AdminSidebar';


export function AdminLayout({ children, userName, role }: { children: React.ReactNode; userName?: string; role?: string }) {
    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                <AdminSidebar userName={userName} role={role} />
                <main
                    style={{
                        flex: 1,
                        width: '100%',
                        paddingBottom: '80px'
                    }}
                    className="admin-content-wrapper"
                >
                    {children}
                </main>

                <style>{`
                    @media (min-width: 768px) {
                    .admin-content-wrapper {
                        margin-left: 240px;
                        padding-bottom: 0 !important;
                    }
                    }
                `}</style>
            </div>
        </>
    );
}