'use client';

import { useState, useTransition } from 'react';
import { User, KeyRound, GraduationCap, Calendar, Shield, CheckCircle } from 'lucide-react';
import { updateProfileAction, changePasswordAction } from './actions';
import styles from './profile.module.css';

export default function ProfileClient({
  userId, userName, role, jurusan, angkatan
}: {
  userId: string; userName: string; role: string; jurusan: string; angkatan: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleProfile = async (formData: FormData) => {
    setProfileMsg(''); setProfileSuccess(false);
    startTransition(async () => {
      const result = await updateProfileAction(null, formData);
      if (result.success) { setProfileSuccess(true); setProfileMsg('Profil berhasil diperbarui!'); }
      else setProfileMsg(result.error);
    });
  };

  const handlePassword = async (formData: FormData) => {
    setPwMsg(''); setPwSuccess(false);
    startTransition(async () => {
      const result = await changePasswordAction(null, formData);
      if (result.success) { setPwSuccess(true); setPwMsg('Password berhasil diubah!'); }
      else setPwMsg(result.error);
    });
  };

  const roleLabel: Record<string, string> = {
    mahasiswa: 'Mahasiswa', dosen: 'Dosen',
    admin_fakultas: 'Admin Fakultas', super_admin: 'Super Admin',
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Profil Saya</h1>
        <p className={styles.subtitle}>Kelola informasi akun dan keamanan Anda</p>

        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className={styles.userName}>{userName}</h2>
              <div className={styles.metaRow}>
                <span className={styles.userId}><Shield size={12} /> {userId}</span>
                <span className={styles.roleBadge}>{roleLabel[role] || role}</span>
              </div>
            </div>
          </div>

          <form action={handleProfile} className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><GraduationCap size={14} /> Jurusan</label>
                <input name="jurusan" className={styles.input} defaultValue={jurusan} placeholder="Teknik Informatika" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><Calendar size={14} /> Angkatan</label>
                <input name="angkatan" className={styles.input} defaultValue={angkatan} placeholder="2023" />
              </div>
            </div>
            {profileMsg && (
              <div className={profileSuccess ? styles.successBox : styles.errorBox}>
                {profileSuccess && <CheckCircle size={14} />} {profileMsg}
              </div>
            )}
            <button type="submit" className={styles.btnSubmit} disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><KeyRound size={16} /> Ubah Password</h3>
          <form action={handlePassword} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password Saat Ini</label>
              <input name="current_password" type="password" className={styles.input} required placeholder="••••••••" />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password Baru</label>
                <input name="new_password" type="password" className={styles.input} required placeholder="Min 6 karakter" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Konfirmasi Password</label>
                <input name="confirm_password" type="password" className={styles.input} required placeholder="Ulangi password" />
              </div>
            </div>
            {pwMsg && (
              <div className={pwSuccess ? styles.successBox : styles.errorBox}>
                {pwSuccess && <CheckCircle size={14} />} {pwMsg}
              </div>
            )}
            <button type="submit" className={styles.btnSubmit} disabled={isPending}>
              {isPending ? 'Mengubah...' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
