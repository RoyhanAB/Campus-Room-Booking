'use client';

import { useMemo, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createAdminAction, reassignAdminFakultasAction, deleteAdminAction } from '../super-actions';
import { AdminWithFakultas } from '@/lib/user';
import { Fakultas } from '@/types/fakultas';
import styles from '../kelola.module.css';

export default function KelolaAdminClient({ 
  admins, 
  fakultas 
}: { 
  admins: AdminWithFakultas[]; 
  fakultas: Fakultas[];
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [reassignAdmin, setReassignAdmin] = useState<AdminWithFakultas | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const uniqueFakultas = useMemo(
    () => Array.from(new Map(fakultas.map((item) => [item.fakultas_name.trim().toLowerCase(), item])).values()),
    [fakultas],
  );

  const handleAdd = () => {
    setError('');
    setSuccess('');
    setShowAddModal(true);
  };

  const handleReassign = (admin: AdminWithFakultas) => {
    setReassignAdmin(admin);
    setError('');
    setSuccess('');
  };

  const handleDelete = (userId: string, userName: string) => {
    if (!confirm(`Yakin ingin menghapus admin "${userName}"? Akun ini akan dihapus permanen.`)) return;
    startTransition(async () => {
      await deleteAdminAction(userId);
      router.refresh();
    });
  };

  const handleAddSubmit = async (formData: FormData) => {
    setError('');
    setSuccess('');
    startTransition(async () => {
      const result = await createAdminAction(null, formData);
      if (result.success) {
        setSuccess('Admin berhasil ditambahkan!');
        setTimeout(() => {
          setShowAddModal(false);
          router.refresh();
        }, 800);
      } else {
        setError(result.error);
      }
    });
  };

  const handleReassignSubmit = async (formData: FormData) => {
    if (!reassignAdmin) return;
    const newFakultasId = Number(formData.get('fakultas_id'));
    if (!newFakultasId) {
      setError('Pilih fakultas baru.');
      return;
    }
    setError('');
    startTransition(async () => {
      await reassignAdminFakultasAction(reassignAdmin.user_id, newFakultasId);
      setSuccess('Fakultas admin berhasil diubah!');
      setTimeout(() => {
        setReassignAdmin(null);
        router.refresh();
      }, 800);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Kelola Admin</h1>
          <p className={styles.pageSubtitle}>{admins.length} admin terdaftar</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnAdd} onClick={handleAdd}>
            <Plus size={16} /> Tambah Admin
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Nama</th>
              <th>Fakultas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? admins.map((admin) => (
              <tr key={admin.user_id}>
                <td><code style={{ fontSize: 12, background: 'var(--surface-raised)', padding: '2px 6px', borderRadius: 4 }}>{admin.user_id}</code></td>
                <td style={{ fontWeight: 600 }}>{admin.user_name}</td>
                <td>
                  {admin.fakultas_name ? (
                    <span className={styles.badgeAmber}>{admin.fakultas_name}</span>
                  ) : (
                    <span className={styles.badgeBlue}>Belum ditugaskan</span>
                  )}
                </td>
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.btnEdit} onClick={() => handleReassign(admin)}>
                      <Pencil size={12} /> Pindah Fakultas
                    </button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(admin.user_id, admin.user_name)} disabled={isPending}>
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                  Belum ada admin terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {admins.map((admin) => (
          <div key={admin.user_id} className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Nama</span>
              <span className={styles.cardValue}>{admin.user_name}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>User ID</span>
              <span className={styles.cardValue}>{admin.user_id}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Fakultas</span>
              <span className={styles.cardValue}>{admin.fakultas_name || 'Belum ditugaskan'}</span>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => handleReassign(admin)}>Pindah Fakultas</button>
              <button className={styles.btnDelete} onClick={() => handleDelete(admin.user_id, admin.user_name)} disabled={isPending}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Tambah Admin Baru</h3>
            <p className={styles.modalSubtitle}>Buat akun admin baru dan tugaskan ke fakultas</p>
            <form action={handleAddSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>User ID *</label>
                <input name="user_id" className={styles.input} required placeholder="Contoh: ADM003" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nama Lengkap *</label>
                <input name="user_name" className={styles.input} required placeholder="Contoh: Ahmad Fauzi" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password *</label>
                <input name="password" type="password" className={styles.input} required placeholder="Min 6 karakter" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Fakultas *</label>
                <select name="fakultas_id" className={styles.select} required>
                  <option value="">Pilih Fakultas</option>
                  {uniqueFakultas.map((f) => (
                    <option key={f.fakultas_id} value={f.fakultas_id}>{f.fakultas_name}</option>
                  ))}
                </select>
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowAddModal(false)} disabled={isPending}>Batal</button>
                <button type="submit" className={styles.btnSubmit} disabled={isPending}>
                  {isPending ? 'Menyimpan...' : 'Tambah Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Reassign Fakultas Modal */}
      {reassignAdmin && createPortal(
        <div className={styles.modalOverlay} onClick={() => setReassignAdmin(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Pindah Fakultas</h3>
            <p className={styles.modalSubtitle}>
              Pindahkan <strong>{reassignAdmin.user_name}</strong> ke fakultas lain
            </p>
            <form action={handleReassignSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Fakultas Baru *</label>
                <select name="fakultas_id" className={styles.select} defaultValue={reassignAdmin.fakultas_id || ''} required>
                  <option value="">Pilih Fakultas</option>
                  {uniqueFakultas.map((f) => (
                    <option key={f.fakultas_id} value={f.fakultas_id}>{f.fakultas_name}</option>
                  ))}
                </select>
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setReassignAdmin(null)} disabled={isPending}>Batal</button>
                <button type="submit" className={styles.btnSubmit} disabled={isPending}>
                  {isPending ? 'Menyimpan...' : 'Pindahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
