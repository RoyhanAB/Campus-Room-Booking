import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link'; 
import { MapPin, ArrowRight, Users, CalendarDays } from 'lucide-react';
import styles from './roomdetail.module.css';
import { detailroom } from '@/lib/ruangan';
import { getSceduleByRoomId } from '@/lib/schedule';

export const revalidate = 0;

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const room = await detailroom(roomId);

  const schedules = await getSceduleByRoomId(roomId);

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    const { data } = supabase.storage.from('foto').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{room.room_id}</h1>

      <div className={styles.imageWrapper}>
        <Image
          src={getImageUrl(room.foto)}
          alt={`Foto ${room.room_id}`}
          fill
          className={styles.heroImage}
          priority
        />
      </div>

      <div className={styles.card}>
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <MapPin size={20} color="#111827" />
            <span className={styles.statLabel}>Gedung</span>
            <span className={styles.statValue}>AULA</span> 
          </div>
          <div className={styles.statBox}>
            <ArrowRight size={20} color="#111827" />
            <span className={styles.statLabel}>Lantai</span>
            <span className={styles.statValue}>{room.flor}</span>
          </div>
          <div className={styles.statBox}>
            <Users size={20} color="#111827" />
            <span className={styles.statLabel}>Kapasitas</span>
            <span className={styles.statValue}>{room.kapasitas}</span>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Deskripsi</h2>
        <p className={styles.description}>
          {room.deskripsi || 'Belum ada deskripsi untuk ruangan ini.'}
        </p>

        <h2 className={styles.sectionTitle}>Fasilitas</h2>
        <div className={styles.facilitiesGrid}>
          <div className={styles.facilityItem}>AC Sentral</div>
          <div className={styles.facilityItem}>Proyektor & Layar</div>
          <div className={styles.facilityItem}>Sound System</div>
          <div className={styles.facilityItem}>Meja</div>
        </div>

        <Link href={`/formpeminjaman?roomId=${room.room_id}`} className={styles.btnPinjam}>
          Pinjam
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.scheduleHeader}>
          <span className={styles.scheduleDate}>Jadwal Ruangan</span>
          <div className={styles.calendarIconWrapper}>
            <CalendarDays size={20} />
          </div>
        </div>

        {schedules && schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <div key={schedule.schedule_id || index} className={styles.scheduleItem}>
              <h3 className={styles.scheduleTitle}>{schedule.schedule_name}</h3>
              <p className={styles.scheduleTime}>
                {formatTime(schedule.tanggal_dimulai)} - {formatTime(schedule.tanggal_selesai)}
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            Belum ada jadwal untuk ruangan ini.
          </p>
        )}
      </div>
    </div>
  );
}