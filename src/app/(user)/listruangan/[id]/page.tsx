import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link'; 
import { MapPin, ArrowLeft, Users, CalendarDays, Clock, Building2, Layers, ClipboardList, FileText, Link as LinkIcon, Send } from 'lucide-react';
import styles from './roomdetail.module.css';
import { detailroom } from '@/lib/ruangan';
import { getScheduleByRoomId } from '@/lib/schedule';
import { getAllBuildings } from '@/lib/ruangan';
import { getSession } from '@/lib/auth';
import { FormPeminjamanInline } from './FormPeminjamanInline';

export const revalidate = 0;

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const [room, schedules, buildings, session] = await Promise.all([
    detailroom(roomId),
    getScheduleByRoomId(roomId),
    getAllBuildings(),
    getSession()
  ]);

  const building = buildings.find(b => b.building_id === room.building_id);

  // Filter jadwal hari ini saja
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.tanggal_dimulai);
    return scheduleDate >= today && scheduleDate < tomorrow;
  });

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
              <h2 className={styles.scheduleTitle}>Jadwal Hari Ini</h2>
              <p className={styles.scheduleDate}>{formatDate(new Date().toISOString())}</p>
            </div>
            <div className={styles.scheduleIcon}>
              <Clock size={24} />
            </div>
          </div>

          <div className={styles.scheduleList}>
            {todaySchedules && todaySchedules.length > 0 ? (
              todaySchedules.map((schedule, index) => (
                <div key={schedule.schedule_id || index} className={styles.scheduleCard}>
                  <div className={styles.scheduleTime}>
                    <Clock size={16} />
                    <span>
                      {formatTime(schedule.tanggal_dimulai)} - {formatTime(schedule.tanggal_selesai)}
                    </span>
                  </div>
                  <h3 className={styles.scheduleEventName}>{schedule.schedule_name}</h3>
                </div>
              ))
            ) : (
              <div className={styles.emptySchedule}>
                <CalendarDays size={48} />
                <p>Tidak ada jadwal untuk hari ini</p>
                <span>Ruangan tersedia untuk dipinjam</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Peminjaman Inline */}
        <FormPeminjamanInline 
          roomId={room.room_id}
          userId={session?.user_id || ''}
          userName={session?.user_name || ''}
        />
      </div>
    </div>
  );
}