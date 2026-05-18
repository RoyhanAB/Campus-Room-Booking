'use client';

import { useState, useTransition } from 'react';
import { Settings, Clock, Calendar, Shield, CheckCircle } from 'lucide-react';
import { updateSettingAction } from './actions';
import type { JsonValue, SystemSettings } from '@/lib/settings';
import styles from '../kelola.module.css';

interface SettingsProps {
  settings: SystemSettings;
}

const getObjectSetting = <T extends Record<string, JsonValue>>(settings: SystemSettings, key: string, fallback: T) => {
  const value = settings[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? ({ ...fallback, ...value } as T)
    : fallback;
};

export default function SettingsClient({ settings }: SettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Local state for settings
  const jam = getObjectSetting(settings, 'jam_operasional', { buka: '07:00', tutup: '21:00' });
  const durasi = getObjectSetting(settings, 'max_durasi_booking', { jam: 8 });
  const perMinggu = getObjectSetting(settings, 'max_booking_per_minggu', { limit: 5 });
  const maintenanceSetting = getObjectSetting(settings, 'maintenance_mode', { active: false, message: '' });

  const [jamBuka, setJamBuka] = useState(String(jam.buka));
  const [jamTutup, setJamTutup] = useState(String(jam.tutup));
  const [maxDurasi, setMaxDurasi] = useState(Number(durasi.jam));
  const [maxPerMinggu, setMaxPerMinggu] = useState(Number(perMinggu.limit));
  const [maintenance, setMaintenance] = useState(Boolean(maintenanceSetting.active));
  const [maintMsg, setMaintMsg] = useState(String(maintenanceSetting.message || ''));

  const saveSetting = (key: string, value: JsonValue) => {
    setMsg(''); setSuccess(false);
    startTransition(async () => {
      const result = await updateSettingAction(key, value);
      if (result.success) { setSuccess(true); setMsg('Pengaturan berhasil disimpan!'); }
      else setMsg(result.error || 'Gagal menyimpan.');
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}><Settings size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />Pengaturan Sistem</h1>
          <p className={styles.pageSubtitle}>Konfigurasi global untuk sistem peminjaman ruangan</p>
        </div>
      </div>

      {msg && (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 16,
          background: success ? 'var(--green-50)' : 'var(--red-50)',
          color: success ? 'var(--green-700)' : 'var(--red-600)',
          border: `1px solid ${success ? 'var(--green-100)' : 'var(--red-100)'}`,
          fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {success && <CheckCircle size={14} />} {msg}
        </div>
      )}

      {/* Jam Operasional */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} /> Jam Operasional
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Jam Buka</label>
            <input type="time" className={styles.input} value={jamBuka} onChange={e => setJamBuka(e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Jam Tutup</label>
            <input type="time" className={styles.input} value={jamTutup} onChange={e => setJamTutup(e.target.value)} />
          </div>
        </div>
        <button className={styles.btnAdd} style={{ marginTop: 12, fontSize: 12 }} disabled={isPending}
          onClick={() => saveSetting('jam_operasional', { buka: jamBuka, tutup: jamTutup })}>
          Simpan
        </button>
      </div>

      {/* Booking Limits */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} /> Batas Peminjaman
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Max Durasi Booking (jam)</label>
            <input type="number" className={styles.input} min={1} max={24} value={maxDurasi}
              onChange={e => setMaxDurasi(Number(e.target.value))} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Max Booking per Minggu</label>
            <input type="number" className={styles.input} min={1} max={50} value={maxPerMinggu}
              onChange={e => setMaxPerMinggu(Number(e.target.value))} />
          </div>
        </div>
        <button className={styles.btnAdd} style={{ marginTop: 12, fontSize: 12 }} disabled={isPending}
          onClick={() => {
            saveSetting('max_durasi_booking', { jam: maxDurasi });
            saveSetting('max_booking_per_minggu', { limit: maxPerMinggu });
          }}>
          Simpan
        </button>
      </div>

      {/* Maintenance Mode */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} /> Mode Maintenance
        </h3>
        <div className={styles.fieldGroup} style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={maintenance} onChange={e => setMaintenance(e.target.checked)} />
            <span>Aktifkan mode maintenance</span>
          </label>
        </div>
        {maintenance && (
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Pesan Maintenance</label>
            <input className={styles.input} value={maintMsg} onChange={e => setMaintMsg(e.target.value)}
              placeholder="Sistem sedang dalam perbaikan..." />
          </div>
        )}
        <button className={styles.btnAdd} style={{ marginTop: 12, fontSize: 12 }} disabled={isPending}
          onClick={() => saveSetting('maintenance_mode', { active: maintenance, message: maintMsg })}>
          Simpan
        </button>
      </div>
    </div>
  );
}
