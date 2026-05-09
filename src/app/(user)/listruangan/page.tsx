import { supabase } from '@/lib/supabase';
import { Search, Menu } from 'lucide-react';
import styles from './listruangan.module.css';
import Image from 'next/image';
import Link from 'next/link'; 
import { getRoomsLimit15 } from '@/lib/ruangan';

export const revalidate = 0; 

export default async function RoomsPage() {
  const rooms = await getRoomsLimit15();

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg'; 
    const { data } = supabase.storage.from('foto').getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionRow}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Cari ruangan..."
            className={styles.searchInput}
          />
        </div>
        <button className={styles.filterButton}>
          <Menu size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className={styles.gridContainer}>
        {rooms?.map((room) => (
          <Link 
            key={room.room_id} 
            href={`/listruangan/${room.room_id}`} 
            className={styles.card}
            style={{ textDecoration: 'none' }} 
          >
            <Image
              src={getImageUrl(room.foto)}
              alt={`Foto ${room.room_id}`}
              width={75}  
              height={75}
              className={styles.roomImage}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.roomTitle}>{room.room_id}</h3>
              <p className={styles.roomSubtitle}>
                Lt. {room.flor} • Kapasitas {room.kapasitas}
              </p>
            </div>
          </Link>
        ))}

        {(!rooms || rooms.length === 0) && (
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
            Belum ada data ruangan.
          </p>
        )}
      </div>
    </div>
  );
}