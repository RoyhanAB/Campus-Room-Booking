'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { approvePeminjamanAction, rejectPeminjamanAction } from '../../actions';
import styles from './DetailPeminjaman.module.css';

export default function DetailPeminjamanActions({
  peminjamanId,
  currentStatus,
}: {
  peminjamanId: number;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      await approvePeminjamanAction(peminjamanId);
      router.refresh();
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectPeminjamanAction(peminjamanId);
      router.refresh();
    });
  };

  return (
    <div className={styles.actionRow}>
      <button
        className={styles.btnApprove}
        onClick={handleApprove}
        disabled={isPending || currentStatus === 'disetujui'}
      >
        <Check size={18} strokeWidth={3} />
        {isPending ? 'Memproses...' : 'Setujui'}
      </button>
      <button
        className={styles.btnReject}
        onClick={handleReject}
        disabled={isPending || currentStatus === 'ditolak'}
      >
        <X size={18} strokeWidth={3} />
        {isPending ? 'Memproses...' : 'Tolak'}
      </button>
    </div>
  );
}
