'use client';

import { useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createFakultasAction, updateFakultasAction, deleteFakultasAction } from '../super-actions';
import { Fakultas } from '@/types/fakultas';
import styles from '../kelola.module.css';

export default function KelolaFakultasClient({ fakultas }: { fakultas: Fakultas[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Fakultas | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    setEditData(null);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEdit = (f: Fakultas) => {
    setEditData(f);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = (fakultasId: number) => {
    if (!confirm('Yakin ingin menghapus fakultas ini? Semua data terkait (gedung, admin) juga akan terpengaruh.')) return;
    startTransition(async () => {
      await deleteFakultasAction(fakultasId);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setSuccess('');

    const action = editData ? updateFakultasAction : createFakultasAction;
    if (editData) {
      formData.set('fakultas_id', editData.fakultas_id.toString());
    }

    startTransition(async () => {
      const result = await action(null, formData);
      if (result.success) {
        setSuccess(editData ? 'Fakultas berhasil diupdate!' : 'Fakultas berhasil ditambahkan!');
        setTimeout(() => {
          setShowModal(false);
          router.refresh();
        }, 800);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Kelola Fakultas</h1>
          <p className={styles.pageSubtitle}>{fakultas.length} fakultas terdaftar</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnAdd} onClick={handleAdd}>
            <Plus size={16} /> Tambah Fakultas
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Fakultas</th>
              <th>Lokasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {fakultas.length > 0 ? fakultas.map((f) => (
              <tr key={f.fakultas_id}>
                <td>{f.fakultas_id}</td>
                <td style={{ fontWeight: 600 }}>{f.fakultas_name}</td>
                <td>{f.lokasi || '-'}</td>
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.btnEdit} onClick={() => handleEdit(f)}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(f.fakultas_id)} disabled={isPending}>
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                  Belum ada data fakultas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {fakultas.map((f) => (
          <div key={f.fakultas_id} className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Nama Fakultas</span>
              <span className={styles.cardValue}>{f.fakultas_name}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Lokasi</span>
              <span className={styles.cardValue}>{f.lokasi || '-'}</span>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => handleEdit(f)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => handleDelete(f.fakultas_id)} disabled={isPending}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {editData ? 'Edit Fakultas' : 'Tambah Fakultas Baru'}
            </h3>
            <p className={styles.modalSubtitle}>
              {editData ? 'Ubah data fakultas yang dipilih' : 'Isi data fakultas yang akan ditambahkan'}
            </p>
            <form action={handleSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nama Fakultas *</label>
                <input name="fakultas_name" className={styles.input} defaultValue={editData?.fakultas_name || ''} required placeholder="Contoh: Fakultas Teknik" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Lokasi</label>
                <input name="lokasi" className={styles.input} defaultValue={editData?.lokasi || ''} placeholder="Contoh: Kampus 1 Pakupatan" />
              </div>
              {error && <div className={styles.errorBox}>{error}</div>}
              {success && <div className={styles.successBox}>{success}</div>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)} disabled={isPending}>Batal</button>
                <button type="submit" className={styles.btnSubmit} disabled={isPending}>
                  {isPending ? 'Menyimpan...' : editData ? 'Update' : 'Tambah'}
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
