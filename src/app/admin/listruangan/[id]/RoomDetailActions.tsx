'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { deleteRoomAction } from '../../actions';
import styles from './roomdetail.module.css';

export default function RoomDetailActions({ roomId }: { roomId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteRoomAction(roomId);
    });
  };

  return (
    <div className={styles.actionButtons}>
      <Link href={`/admin/editruangan/${roomId}`} className={styles.btnEdit}>
        Edit
      </Link>
      
      <button 
        className={styles.btnDelete} 
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Menghapus...' : 'Hapus'}
      </button>
    </div>
  );
}
