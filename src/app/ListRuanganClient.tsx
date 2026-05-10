'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/types/room';

interface ListRuanganClientProps {
  rooms: Room[];
  basePath: string; // '/listruangan' atau '/admin/listruangan'
  styles: Record<string, string>;
  supabaseUrl: string; // we can pass the image URL directly or construct it here
}

export default function ListRuanganClient({ rooms, basePath, styles }: ListRuanganClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- DoD #3: URL-persisted search ---
  const initialQ = searchParams.get('q') ?? '';
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [isPending, startTransition] = useTransition();

  const updateSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams],
  );

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    return `https://bcyodwqyplkbmsawuqrd.supabase.co/storage/v1/object/public/Foto/${fileName}`;
  };

  const filteredRooms = rooms?.filter((room) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      room.room_id.toLowerCase().includes(q) ||
      room.deskripsi?.toLowerCase().includes(q) ||
      room.floor?.toString().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.actionRow}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Cari ruangan..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => updateSearch(e.target.value)}
          />
        </div>
        <button className={styles.filterButton}>
          <Menu size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className={styles.gridContainer} style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
        {filteredRooms?.map((room) => (
          <Link
            key={room.room_id}
            href={`${basePath}/${room.room_id}`}
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
                Lt. {room.floor} • Kapasitas {room.kapasitas}
              </p>
            </div>
          </Link>
        ))}

        {(!filteredRooms || filteredRooms.length === 0) && (
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
            {searchTerm ? 'Tidak ada ruangan yang cocok.' : 'Belum ada data ruangan.'}
          </p>
        )}
      </div>
    </div>
  );
}
