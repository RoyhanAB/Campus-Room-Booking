'use client';

import { useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, KeyRound, Search } from 'lucide-react';
import { createUserAction, updateUserAction, resetPasswordAction, deleteUserAction } from '../super-actions';
import { UserWithProfile } from '@/lib/user';
import { Fakultas } from '@/types/fakultas';
import styles from '../kelola.module.css';

const roleBadge: Record<string, string> = {
  mahasiswa: 'badgeAmber',
  dosen: 'badgeBlue',
  admin_fakultas: 'badgeGreen',
  super_admin: 'badgeRed',
};

const roleLabel: Record<string, string> = {
  mahasiswa: 'Mahasiswa',
  dosen: 'Dosen',
  admin_fakultas: 'Admin Fakultas',
  super_admin: 'Super Admin',
};

export default function KelolaUserClient({ 
  users, 
  fakultas 
}: { 
  users: UserWithProfile[]; 
  fakultas: Fakultas[];
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<UserWithProfile | null>(null);
  const [resetUser, setResetUser] = useState<UserWithProfile | null>(null);
  const [roleFilter, setRoleFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'semua' || u.role === roleFilter;
    const matchSearch = !search || 
      u.user_id.toLowerCase().includes(search.toLowerCase()) ||
      u.user_name.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    semua: users.length,
    mahasiswa: users.filter(u => u.role === 'mahasiswa').length,
    dosen: users.filter(u => u.role === 'dosen').length,
    admin_fakultas: users.filter(u => u.role === 'admin_fakultas').length,
    super_admin: users.filter(u => u.role === 'super_admin').length,
  };

  const handleDelete = (userId: string, userName: string) => {
    if (!confirm(`Yakin ingin menghapus user "${userName}" (${userId})? Data tidak bisa dikembalikan.`)) return;
    startTransition(async () => {
      await deleteUserAction(userId);
      router.refresh();
    });
  };

  const handleAddSubmit = async (formData: FormData) => {
    setError(''); setSuccess('');
    startTransition(async () => {
      const result = await createUserAction(null, formData);
      if (result.success) {
        setSuccess('User berhasil ditambahkan!');
        setTimeout(() => { setShowAdd(false); router.refresh(); }, 800);
      } else {
        setError(result.error);
      }
    });
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!editUser) return;
    formData.set('user_id', editUser.user_id);
    setError(''); setSuccess('');
    startTransition(async () => {
      const result = await updateUserAction(null, formData);
      if (result.success) {
        setSuccess('User berhasil diupdate!');
        setTimeout(() => { setEditUser(null); router.refresh(); }, 800);
      } else {
        setError(result.error);
      }
    });
  };

  const handleResetPassword = () => {
    if (!resetUser || !newPassword) return;
    setError(''); setSuccess('');
    startTransition(async () => {
      try {
        await resetPasswordAction(resetUser.user_id, newPassword);
        setSuccess('Password berhasil direset!');
        setNewPassword('');
        setTimeout(() => { setResetUser(null); }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal reset password.');
      }
    });
  };

  const filterPills = ['semua', 'mahasiswa', 'dosen', 'admin_fakultas', 'super_admin'];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Kelola User</h1>
          <p className={styles.pageSubtitle}>{users.length} user terdaftar</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnAdd} onClick={() => { setShowAdd(true); setError(''); setSuccess(''); }}>
            <Plus size={16} /> Tambah User
          </button>
        </div>
      </div>

      {/* Filter + Search */}
      <div style={{ maxWidth: 1200, margin: '0 auto 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {filterPills.map(f => (
          <button
            key={f}
            onClick={() => setRoleFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: roleFilter === f ? 'var(--amber-500)' : '#fff',
              color: roleFilter === f ? '#fff' : 'var(--ink-muted)',
              border: `1px solid ${roleFilter === f ? 'var(--amber-500)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
          >
            {f === 'semua' ? 'Semua' : roleLabel[f] || f} ({counts[f as keyof typeof counts] || 0})
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px' }}>
          <Search size={14} style={{ color: 'var(--ink-muted)' }} />
          <input
            placeholder="Cari user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, width: 140, background: 'transparent' }}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Jurusan</th>
              <th>Angkatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((u) => (
              <tr key={u.user_id}>
                <td><code style={{ fontSize: 12, background: 'var(--surface-raised)', padding: '2px 6px', borderRadius: 4 }}>{u.user_id}</code></td>
                <td style={{ fontWeight: 600 }}>{u.user_name}</td>
                <td><span className={styles[roleBadge[u.role] || 'badgeAmber']}>{roleLabel[u.role] || u.role}</span></td>
                <td>{u.jurusan || '-'}</td>
                <td>{u.angkatan || '-'}</td>
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.btnEdit} onClick={() => { setEditUser(u); setError(''); setSuccess(''); }}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button className={styles.btnEdit} onClick={() => { setResetUser(u); setError(''); setSuccess(''); setNewPassword(''); }} style={{ background: '#fef3c7', color: '#92400e' }}>
                      <KeyRound size={12} /> Reset
                    </button>
                    {u.role !== 'super_admin' && (
                      <button className={styles.btnDelete} onClick={() => handleDelete(u.user_id, u.user_name)} disabled={isPending}>
                        <Trash2 size={12} /> Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                  Tidak ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {filtered.map((u) => (
          <div key={u.user_id} className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Nama</span>
              <span className={styles.cardValue}>{u.user_name}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>User ID</span>
              <span className={styles.cardValue}>{u.user_id}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Role</span>
              <span className={styles.cardValue}>{roleLabel[u.role] || u.role}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Jurusan</span>
              <span className={styles.cardValue}>{u.jurusan || '-'}</span>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => { setEditUser(u); setError(''); setSuccess(''); }}>Edit</button>
              <button className={styles.btnEdit} onClick={() => { setResetUser(u); setError(''); setSuccess(''); setNewPassword(''); }} style={{ background: '#fef3c7', color: '#92400e' }}>Reset PW</button>
              {u.role !== 'super_admin' && (
                <button className={styles.btnDelete} onClick={() => handleDelete(u.user_id, u.user_name)} disabled={isPending}>Hapus</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAdd && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Tambah User Baru</h3>
            <p className={styles.modalSubtitle}>Buat akun user baru (mahasiswa, dosen, atau admin)</p>
            <form action={handleAddSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>User ID *</label>
                <input name="user_id" className={styles.input} required placeholder="Contoh: USR005" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nama Lengkap *</label>
                <input name="user_name" className={styles.input} required placeholder="Contoh: Budi Santoso" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password *</label>
                <input name="password" type="password" className={styles.input} required placeholder="Min 6 karakter" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Role *</label>
                <select name="role" className={styles.select} required>
                  <option value="">Pilih Role</option>
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin_fakultas">Admin Fakultas</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Jurusan</label>
                <input name="jurusan" className={styles.input} placeholder="Contoh: Teknik Informatika" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Angkatan</label>
                <input name="angkatan" className={styles.input} placeholder="Contoh: 2023" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Fakultas (untuk Admin)</label>
                <select name="fakultas_id" className={styles.select}>
                  <option value="">Pilih Fakultas</option>
                  {fakultas.map(f => <option key={f.fakultas_id} value={f.fakultas_id}>{f.fakultas_name}</option>)}
                </select>
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowAdd(false)} disabled={isPending}>Batal</button>
                <button type="submit" className={styles.btnSubmit} disabled={isPending}>
                  {isPending ? 'Menyimpan...' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit User Modal */}
      {editUser && createPortal(
        <div className={styles.modalOverlay} onClick={() => setEditUser(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit User</h3>
            <p className={styles.modalSubtitle}>Ubah data user <strong>{editUser.user_name}</strong></p>
            <form action={handleEditSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nama Lengkap *</label>
                <input name="user_name" className={styles.input} defaultValue={editUser.user_name} required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Role *</label>
                <select name="role" className={styles.select} defaultValue={editUser.role} required>
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin_fakultas">Admin Fakultas</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Jurusan</label>
                <input name="jurusan" className={styles.input} defaultValue={editUser.jurusan || ''} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Angkatan</label>
                <input name="angkatan" className={styles.input} defaultValue={editUser.angkatan || ''} />
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setEditUser(null)} disabled={isPending}>Batal</button>
                <button type="submit" className={styles.btnSubmit} disabled={isPending}>
                  {isPending ? 'Menyimpan...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Reset Password Modal */}
      {resetUser && createPortal(
        <div className={styles.modalOverlay} onClick={() => setResetUser(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Reset Password</h3>
            <p className={styles.modalSubtitle}>Reset password untuk <strong>{resetUser.user_name}</strong> ({resetUser.user_id})</p>
            <div className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password Baru *</label>
                <input
                  type="password"
                  className={styles.input}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 karakter"
                />
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setResetUser(null)} disabled={isPending}>Batal</button>
                <button type="button" className={styles.btnSubmit} onClick={handleResetPassword} disabled={isPending || newPassword.length < 6}>
                  {isPending ? 'Mereset...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
