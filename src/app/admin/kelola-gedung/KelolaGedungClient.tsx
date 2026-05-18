'use client';

import { useMemo, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createBuildingAction, updateBuildingAction, deleteBuildingAction } from '../super-actions';
import { Building } from '@/types/building';
import { Fakultas } from '@/types/fakultas';
import styles from '../kelola.module.css';

interface BuildingWithFakultas extends Building {
  fakultas_name?: string;
}

export default function KelolaGedungClient({ 
  buildings, 
  fakultas 
}: { 
  buildings: BuildingWithFakultas[]; 
  fakultas: Fakultas[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<BuildingWithFakultas | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const uniqueFakultas = useMemo(
    () => Array.from(new Map(fakultas.map((item) => [item.fakultas_name.trim().toLowerCase(), item])).values()),
    [fakultas],
  );

  const handleAdd = () => {
    setEditData(null);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEdit = (building: BuildingWithFakultas) => {
    setEditData(building);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = (buildingId: number) => {
    if (!confirm('Yakin ingin menghapus gedung ini? Semua ruangan di gedung ini juga akan terhapus.')) return;
    startTransition(async () => {
      await deleteBuildingAction(buildingId);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setSuccess('');

    const action = editData ? updateBuildingAction : createBuildingAction;
    if (editData) {
      formData.set('building_id', editData.building_id.toString());
    }

    startTransition(async () => {
      const result = await action(null, formData);
      if (result.success) {
        setSuccess(editData ? 'Gedung berhasil diupdate!' : 'Gedung berhasil ditambahkan!');
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
          <h1 className={styles.pageTitle}>Kelola Gedung</h1>
          <p className={styles.pageSubtitle}>{buildings.length} gedung terdaftar</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnAdd} onClick={handleAdd}>
            <Plus size={16} /> Tambah Gedung
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Gedung</th>
              <th>Fakultas</th>
              <th>Jumlah Lantai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {buildings.length > 0 ? buildings.map((b, index) => (
              <tr key={b.building_id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: 600 }}>{b.building_name}</td>
                <td><span className={styles.badgeAmber}>{b.fakultas_name || '-'}</span></td>
                <td>{b.floor} lantai</td>
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.btnEdit} onClick={() => handleEdit(b)}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(b.building_id)} disabled={isPending}>
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                  Belum ada data gedung.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {buildings.map((b) => (
          <div key={b.building_id} className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Nama Gedung</span>
              <span className={styles.cardValue}>{b.building_name}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Fakultas</span>
              <span className={styles.cardValue}>{b.fakultas_name || '-'}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Lantai</span>
              <span className={styles.cardValue}>{b.floor}</span>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => handleEdit(b)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => handleDelete(b.building_id)} disabled={isPending}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {editData ? 'Edit Gedung' : 'Tambah Gedung Baru'}
            </h3>
            <p className={styles.modalSubtitle}>
              {editData ? 'Ubah data gedung yang dipilih' : 'Isi data gedung yang akan ditambahkan'}
            </p>
            <form action={handleSubmit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nama Gedung *</label>
                <input name="building_name" className={styles.input} defaultValue={editData?.building_name || ''} required placeholder="Contoh: Gedung Teknik Utama" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Fakultas *</label>
                <select name="fakultas_id" className={styles.select} defaultValue={editData?.fakultas_id || ''} required>
                  <option value="">Pilih Fakultas</option>
                  {uniqueFakultas.map((f) => (
                    <option key={f.fakultas_id} value={f.fakultas_id}>{f.fakultas_name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Jumlah Lantai *</label>
                <input name="floor" type="number" min={1} className={styles.input} defaultValue={editData?.floor || ''} required placeholder="5" />
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
