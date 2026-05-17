import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import AuditLogClient from './AuditLogClient';

export const revalidate = 0;

export default async function AuditLogPage() {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    return <div style={{ padding: 40, textAlign: 'center' }}>Unauthorized</div>;
  }

  // Fetch recent audit logs 
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Also fetch recent peminjaman changes as "activity"
  const { data: recentActivity } = await supabase
    .from('peminjaman')
    .select('peminjaman_id, room_id, user_id, nama_kegiatan, status, created_at, approved_by, alasan_penolakan')
    .order('created_at', { ascending: false })
    .limit(50);

  return <AuditLogClient logs={logs || []} recentActivity={recentActivity || []} />;
}
