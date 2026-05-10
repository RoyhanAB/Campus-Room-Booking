'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updateRoomAction } from '../../actions';
import { Room } from '@/types/room';
import { Building } from '@/types/building';
import styles from './EditRuangan.module.css';

export default function EditRuanganForm({ room, buildings }: { room: Room; buildings: Building[] }) {
  const [state, formAction, isPending] = useActionState(updateRoomAction, null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/admin/listruangan/${room.room_id}`} className={styles.backLink}>
          <ArrowLeft size={18} /> Kembali
        </Link>
      </div>

      <div className={styles.formCard}>
        <h1 className={styles.title}>Edit Ruangan {room.room_id}</h1>
        <p className={styles.subtitle}>Ubah data ruangan sesuai kebutuhan.</p>

        <form action={formAction} className={styles.form}>
          {/* Hidden room_id */}
          <input type="hidden" name="room_id" value={room.room_id} />

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="room_id_display" className={styles.label}>Room ID</label>
              <input
                id="room_id_display"
                type="text"
                value={room.room_id}
                className={styles.input}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="building_id" className={styles.label}>Gedung *</label>
              <select
                id="building_id"
                name="building_id"
                className={styles.input}
                defaultValue={room.building_id}
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
                defaultValue={room.floor}
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
                defaultValue={room.number}
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
                defaultValue={room.kapasitas}
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
              defaultValue={room.deskripsi}
              className={styles.textarea}
            />
          </div>

          {state?.error && (
            <div className={styles.errorBox}>
              {state.error}
            </div>
          )}

          <button type="submit" disabled={isPending} className={styles.submitBtn}>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
