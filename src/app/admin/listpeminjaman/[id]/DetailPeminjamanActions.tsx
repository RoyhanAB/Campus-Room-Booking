'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import { approvePeminjamanAction, rejectPeminjamanAction } from '../../../admin/actions';
import styles from './DetailPeminjaman.module.css';

const ALASAN_UMUM = [
  'Ruangan sudah dibooking di waktu yang sama',
  'Dokumen pendukung tidak lengkap',
  'Kegiatan tidak sesuai dengan fungsi ruangan',
  'Kapasitas peserta melebihi kapasitas ruangan',
  'Waktu peminjaman terlalu singkat/panjang',
  'Lainnya (tulis manual)',
];

export default function DetailPeminjamanActions({
  peminjamanId,
  currentStatus,
}: {
  peminjamanId: number;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAlasan, setSelectedAlasan] = useState('');
  const [customAlasan, setCustomAlasan] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleApprove = () => {
    setErrorMessage('');
    startTransition(async () => {
      const result = await approvePeminjamanAction(peminjamanId);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    const alasan = selectedAlasan === 'Lainnya (tulis manual)' ? customAlasan : selectedAlasan;
    
    if (!alasan.trim()) {
      alert('Mohon pilih atau tulis alasan penolakan');
      return;
    }

    startTransition(async () => {
      await rejectPeminjamanAction(peminjamanId, alasan);
      setShowRejectModal(false);
      router.refresh();
    });
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedAlasan('');
    setCustomAlasan('');
  };

  const modalContent = showRejectModal ? (
    <div className={styles.modalOverlay} onClick={handleRejectCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Alasan Penolakan</h3>
        <p className={styles.modalSubtitle}>
          Pilih atau tulis alasan penolakan peminjaman ini
        </p>

        <div className={styles.alasanList}>
          {ALASAN_UMUM.map((alasan) => (
            <label key={alasan} className={styles.alasanOption}>
              <input
                type="radio"
                name="alasan"
                value={alasan}
                checked={selectedAlasan === alasan}
                onChange={(e) => {
                  setSelectedAlasan(e.target.value);
                }}
                className={styles.alasanRadio}
              />
              <span className={styles.alasanText}>{alasan}</span>
            </label>
          ))}
        </div>

        {selectedAlasan === 'Lainnya (tulis manual)' && (
          <textarea
            className={styles.customAlasanInput}
            placeholder="Tulis alasan penolakan..."
            value={customAlasan}
            onChange={(e) => setCustomAlasan(e.target.value)}
            rows={3}
          />
        )}

        <div className={styles.modalActions}>
          <button
            className={styles.modalBtnCancel}
            onClick={handleRejectCancel}
            disabled={isPending}
          >
            Batal
          </button>
          <button
            className={styles.modalBtnConfirm}
            onClick={handleRejectConfirm}
            disabled={isPending}
          >
            {isPending ? 'Memproses...' : 'Tolak Peminjaman'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.actionRow}>
        <button
          className={styles.btnApprove}
          onClick={handleApprove}
          disabled={isPending || currentStatus === 'disetujui'}
        >
          <Check size={18} strokeWidth={2.5} />
          {isPending ? 'Memproses...' : 'Setujui'}
        </button>
        <button
          className={styles.btnReject}
          onClick={handleRejectClick}
          disabled={isPending || currentStatus === 'ditolak'}
        >
          <X size={18} strokeWidth={2.5} />
          Tolak
        </button>
      </div>

      {/* Error Message — Schedule Conflict */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}

      {/* Modal Alasan Penolakan - Rendered via Portal */}
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
