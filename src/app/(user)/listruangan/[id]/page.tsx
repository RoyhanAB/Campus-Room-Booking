import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link'; 
import { ArrowLeft, Users, Clock, Building2, Layers } from 'lucide-react';
import styles from './roomdetail.module.css';
import { detailroom } from '@/lib/ruangan';
import { getScheduleByRoomId } from '@/lib/schedule';
import { getAllBuildings } from '@/lib/ruangan';
import { getSession } from '@/lib/auth';
import { FormPeminjamanInline } from './FormPeminjamanInline';
import { getSettingObject, getSystemSettings } from '@/lib/settings';
import ScheduleListClient from './ScheduleListClient';

export const revalidate = 0;

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const [room, schedules, buildings, session, settings] = await Promise.all([
    detailroom(roomId),
    getScheduleByRoomId(roomId),
    getAllBuildings(),
    getSession(),
    getSystemSettings(),
  ]);

  const building = buildings.find(b => b.building_id === room.building_id);
  const maxDurasi = getSettingObject(settings, 'max_durasi_booking', { jam: 8 });

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    const { data } = supabase.storage.from('Foto').getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/listruangan" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </Link>

        <div className={styles.heroSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={getImageUrl(room.foto)}
              alt={`Ruangan ${room.room_id}`}
              fill
              className={styles.heroImage}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className={styles.imageBadge}>{room.room_id}</div>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.roomTitle}>
              {building?.building_name || 'Ruangan'}
            </h1>
            <p className={styles.roomSubtitle}>
              {room.deskripsi || 'Ruangan untuk berbagai kegiatan kampus'}
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <Building2 size={24} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Gedung</span>
                  <span className={styles.statValue}>
                    {building?.building_name || '-'}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <Layers size={24} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Lantai</span>
                  <span className={styles.statValue}>{room.floor}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <Users size={24} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Kapasitas</span>
                  <span className={styles.statValue}>{room.kapasitas} orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h2 className={styles.scheduleTitle}>Jadwal Ruangan</h2>
              <p className={styles.scheduleDate}>Filter jadwal berdasarkan hari</p>
            </div>
            <div className={styles.scheduleIcon}>
              <Clock size={24} />
            </div>
          </div>

          <ScheduleListClient schedules={schedules ?? []} />
        </div>

        {/* Form Peminjaman Inline */}
        <FormPeminjamanInline 
          roomId={room.room_id}
          userId={session?.user_id || ''}
          userName={session?.user_name || ''}
          kapasitas={room.kapasitas}
          maxBookingHours={Number(maxDurasi.jam || 8)}
        />
      </div>
    </div>
  );
}
