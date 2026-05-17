import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link'; 
import { MapPin, Users, CalendarDays, Clock, Building2, Layers, ArrowLeft } from 'lucide-react';
import styles from './roomdetail.module.css';
import { detailroom, getAllBuildings } from '@/lib/ruangan';
import { getScheduleByRoomId } from '@/lib/schedule';
import RoomDetailActions from './RoomDetailActions';

export const revalidate = 0;

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const [room, schedules, buildings] = await Promise.all([
    detailroom(roomId),
    getScheduleByRoomId(roomId),
    getAllBuildings(),
  ]);

  const building = buildings.find(b => b.building_id === room.building_id);

  const getImageUrl = (fileName: string) => {
    if (!fileName) return '/placeholder.jpg';
    const { data } = supabase.storage.from('Foto').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/admin/listruangan" className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={getImageUrl(room.foto)}
              alt={`Foto ${room.room_id}`}
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
                <Building2 size={20} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Gedung</span>
                  <span className={styles.statValue}>
                    {building?.building_name || '-'}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <Layers size={20} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Lantai</span>
                  <span className={styles.statValue}>{room.floor}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <Users size={20} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Kapasitas</span>
                  <span className={styles.statValue}>{room.kapasitas} orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h2 className={styles.scheduleTitle}>Jadwal Ruangan</h2>
              <p className={styles.scheduleSubtitle}>Semua jadwal yang terdaftar</p>
            </div>
            <div className={styles.scheduleIcon}>
              <Clock size={20} />
            </div>
          </div>

          <div className={styles.scheduleList}>
            {schedules && schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <div key={schedule.schedule_id || index} className={styles.scheduleCard}>
                  <div className={styles.scheduleTime}>
                    <Clock size={14} />
                    <span>
                      {formatDate(schedule.tanggal_dimulai)} · {formatTime(schedule.tanggal_dimulai)} - {formatTime(schedule.tanggal_selesai)}
                    </span>
                  </div>
                  <h3 className={styles.scheduleEventName}>{schedule.schedule_name}</h3>
                </div>
              ))
            ) : (
              <div className={styles.emptySchedule}>
                <CalendarDays size={36} />
                <p>Belum ada jadwal untuk ruangan ini</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <RoomDetailActions roomId={room.room_id} />
      </div>
    </div>
  );
}