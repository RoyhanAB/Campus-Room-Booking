'use client';

import { useState } from 'react';
import { FileText, Activity, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from '../kelola.module.css';

const formatDateTime = (d: string) => new Date(d).toLocaleString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const statusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disetujui': return <CheckCircle size={14} style={{ color: 'var(--green-600)' }} />;
    case 'ditolak': return <XCircle size={14} style={{ color: 'var(--red-600)' }} />;
    case 'dibatalkan': return <AlertCircle size={14} style={{ color: '#6b7280' }} />;
    default: return <Clock size={14} style={{ color: 'var(--amber-600)' }} />;
  }
};

export default function AuditLogClient({ logs, recentActivity }: { logs: any[]; recentActivity: any[] }) {
  const [tab, setTab] = useState<'activity' | 'logs'>('activity');

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}><Activity size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />Audit Log</h1>
          <p className={styles.pageSubtitle}>Riwayat aktivitas dan perubahan sistem</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <button
          onClick={() => setTab('activity')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: tab === 'activity' ? 'var(--amber-500)' : '#fff',
            color: tab === 'activity' ? '#fff' : 'var(--ink-muted)',
            border: `1px solid ${tab === 'activity' ? 'var(--amber-500)' : 'var(--border)'}`,
            cursor: 'pointer',
          }}
        >
          <Activity size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} /> Aktivitas Peminjaman
        </button>
        <button
          onClick={() => setTab('logs')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: tab === 'logs' ? 'var(--amber-500)' : '#fff',
            color: tab === 'logs' ? '#fff' : 'var(--ink-muted)',
            border: `1px solid ${tab === 'logs' ? 'var(--amber-500)' : 'var(--border)'}`,
            cursor: 'pointer',
          }}
        >
          <FileText size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} /> System Logs
        </button>
      </div>

      {tab === 'activity' ? (
        <div className={styles.tableCard}>
          {recentActivity.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>
              Belum ada aktivitas.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>User</th>
                  <th>Kegiatan</th>
                  <th>Ruangan</th>
                  <th>Status</th>
                  <th>Ditangani</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.peminjaman_id}>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDateTime(item.created_at)}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                        <User size={12} /> {item.user_id}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{item.nama_kegiatan}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                        <MapPin size={12} /> {item.room_id}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                        {statusIcon(item.status)} {item.status || 'menunggu'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item.approved_by || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className={styles.tableCard}>
          {logs.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>
              Belum ada system logs. Tabel <code>audit_logs</code> perlu dibuat di Supabase.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>User</th>
                  <th>Aksi</th>
                  <th>Entity</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDateTime(log.created_at)}</td>
                    <td style={{ fontSize: 12 }}>{log.user_id}</td>
                    <td><span style={{ fontSize: 12, fontWeight: 600 }}>{log.action}</span></td>
                    <td style={{ fontSize: 12 }}>{log.entity_type}:{log.entity_id}</td>
                    <td style={{ fontSize: 11, color: 'var(--ink-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.details ? JSON.stringify(log.details).substring(0, 80) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
