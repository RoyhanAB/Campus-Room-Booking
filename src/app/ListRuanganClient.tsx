'use client';

import { useState, useCallback, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Building2, Layers, Users, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/types/room';
import { Building } from '@/types/building';
import { Fakultas } from '@/types/fakultas';

interface ListRuanganClientProps {
  rooms: Room[];
  buildings: Building[];
  fakultas: Fakultas[];
  basePath: string;
  styles: Record<string, string>;
}

export default function ListRuanganClient({ 
  rooms, 
  buildings,
  fakultas,
  basePath, 
  styles 
}: ListRuanganClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') ?? '';
  const initialBuilding = searchParams.get('building') ?? '';
  const initialFakultas = searchParams.get('fakultas') ?? '';
  
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedBuilding, setSelectedBuilding] = useState(initialBuilding);
  const [selectedFakultas, setSelectedFakultas] = useState(initialFakultas);
  const [isPending, startTransition] = useTransition();
  const showAddRoomAction = basePath.startsWith('/admin');

  const uniqueFakultas = useMemo(() => {
    return Array.from(new Map(fakultas.map((item) => [item.fakultas_name.trim().toLowerCase(), item])).values());
  }, [fakultas]);

  const uniqueBuildings = useMemo(() => {
    return Array.from(new Map(buildings.map((item) => [`${item.fakultas_id}:${item.building_name.trim().toLowerCase()}`, item])).values());
  }, [buildings]);

  const updateFilters = useCallback(
    (search: string, building: string, fakultasId: string) => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (building) params.set('building', building);
      if (fakultasId) params.set('fakultas', fakultasId);
      
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters(value, selectedBuilding, selectedFakultas);
  };

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    updateFilters(searchTerm, value, selectedFakultas);
  };

  const handleFakultasChange = (value: string) => {
    setSelectedFakultas(value);
    setSelectedBuilding(''); // Reset building filter saat fakultas berubah
    updateFilters(searchTerm, '', value);
  };

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    return `https://bcyodwqyplkbmsawuqrd.supabase.co/storage/v1/object/public/Foto/${fileName}`;
  };

  // Filter buildings berdasarkan fakultas yang dipilih
  const filteredBuildings = selectedFakultas
    ? uniqueBuildings.filter(b => b.fakultas_id.toString() === selectedFakultas)
    : uniqueBuildings;

  const filteredRooms = rooms?.filter((room) => {
    const matchesSearch = !searchTerm || 
      room.room_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBuilding = !selectedBuilding || 
      room.building_id.toString() === selectedBuilding;

    // Filter by fakultas
    const roomBuilding = uniqueBuildings.find(b => b.building_id === room.building_id);
    const matchesFakultas = !selectedFakultas || 
      roomBuilding?.fakultas_id.toString() === selectedFakultas;

    return matchesSearch && matchesBuilding && matchesFakultas;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Ruangan Tersedia</h1>
          <p className={styles.subtitle}>
            Pilih ruangan yang sesuai untuk kegiatan Anda
          </p>
        </div>
        {showAddRoomAction && (
          <Link href="/admin/tambahruangan" className={styles.addRoomButton}>
            <Plus size={16} />
            <span>Tambah Ruangan</span>
          </Link>
        )}

        <div className={styles.actionRow}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Cari ruangan..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={selectedFakultas}
              onChange={(e) => handleFakultasChange(e.target.value)}
            >
              <option value="">Semua Fakultas</option>
              {uniqueFakultas.map((fak) => (
                <option key={fak.fakultas_id} value={fak.fakultas_id}>
                  {fak.fakultas_name}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={selectedBuilding}
              onChange={(e) => handleBuildingChange(e.target.value)}
            >
              <option value="">Semua Gedung</option>
              {filteredBuildings.map((building) => (
                <option key={building.building_id} value={building.building_id}>
                  {building.building_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div 
        className={styles.gridContainer} 
        style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.3s' }}
      >
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            const building = uniqueBuildings.find(b => b.building_id === room.building_id);
            
            return (
              <Link
                key={room.room_id}
                href={`${basePath}/${room.room_id}`}
                className={styles.card}
              >
                <div className={styles.roomImageWrapper}>
                  <Image
                    src={getImageUrl(room.foto)}
                    alt={`Ruangan ${room.room_id}`}
                    fill
                    className={styles.roomImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className={styles.roomBadge}>
                    {room.room_id}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.roomTitle}>
                    {building?.building_name || 'Gedung'}
                  </h3>

                  {room.deskripsi && (
                    <p className={styles.roomDescription}>
                      {room.deskripsi}
                    </p>
                  )}

                  <div className={styles.roomMeta}>
                    <div className={styles.metaItem}>
                      <Layers size={16} />
                      <span>Lantai {room.floor}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Users size={16} />
                      <span>{room.kapasitas} orang</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Building2 size={48} />
            </div>
            <h3>Tidak Ada Ruangan</h3>
            <p>
              {searchTerm || selectedBuilding || selectedFakultas
                ? 'Tidak ada ruangan yang sesuai dengan filter'
                : 'Belum ada data ruangan tersedia'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
