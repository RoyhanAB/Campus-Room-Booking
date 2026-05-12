'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createRoomAction } from '../actions';
import { Building } from '@/types/building';
import ImageUpload from '@/components/ImageUpload';
import styles from './TambahRuangan.module.css';

export default function TambahRuanganForm({ buildings }: { buildings: Building[] }) {
  const [state, formAction, isPending] = useActionState(createRoomAction, null);
  const [foto, setFoto] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/listruangan" className={styles.backLink}>
          <ArrowLeft size={18} /> Kembali
        </Link>
      </div>

      <div className={styles.formCard}>
        <h1 className={styles.title}>Tambah Ruangan Baru</h1>
        <p className={styles.subtitle}>Isi data berikut untuk menambahkan ruangan baru ke sistem.</p>

        <form action={formAction} className={styles.form}>
          <input type="hidden" name="foto" value={foto} />

          <div className={styles.fieldGroup}>
            <label htmlFor="foto" className={styles.label}>Foto Ruangan</label>
            <ImageUpload
              currentImage={foto}
              onImageChange={setFoto}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="room_id" className={styles.label}>Room ID *</label>
              <input
                id="room_id"
                name="room_id"
                type="text"
                placeholder="Contoh: R011"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="building_id" className={styles.label}>Gedung *</label>
              <select
                id="building_id"
                name="building_id"
                className={styles.input}
                required
              >
                <option value="">Pilih Gedung</option>
                {buildings.map((b) => (
                  <option key={b.building_id} value={b.building_id}>
                    {b.building_name} ({b.floor} lantai)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="floor" className={styles.label}>Lantai *</label>
              <input
                id="floor"
                name="floor"
                type="number"
                min={1}
                placeholder="1"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="number" className={styles.label}>Nomor Ruangan</label>
              <input
                id="number"
                name="number"
                type="number"
                min={1}
                placeholder="101"
                className={styles.input}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="kapasitas" className={styles.label}>Kapasitas *</label>
              <input
                id="kapasitas"
                name="kapasitas"
                type="number"
                min={1}
                placeholder="40"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="deskripsi" className={styles.label}>Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={3}
              placeholder="Deskripsi ruangan..."
              className={styles.textarea}
            />
          </div>

          {state?.error && (
            <div className={styles.errorBox}>
              {state.error}
            </div>
          )}

          <button type="submit" disabled={isPending} className={styles.submitBtn}>
            {isPending ? 'Menyimpan...' : 'Tambah Ruangan'}
          </button>
        </form>
      </div>
    </div>
  );
}
