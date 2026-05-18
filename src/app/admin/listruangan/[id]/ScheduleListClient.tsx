'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import type { Schedule } from '@/types/schedule';
import { formatLocalDate, formatLocalTime, nowInJakartaLocal, normalizeDateTimeLocal } from '@/lib/datetime';
import styles from './roomdetail.module.css';

export default function ScheduleListClient({ schedules }: { schedules: Schedule[] }) {
  const today = nowInJakartaLocal().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState('');

  const filteredSchedules = useMemo(() => {
    if (!selectedDate) return schedules;
    return schedules.filter((schedule) => normalizeDateTimeLocal(schedule.tanggal_dimulai).slice(0, 10) === selectedDate);
  }, [schedules, selectedDate]);

  return (
    <>
      <div className={styles.scheduleFilters}>
        <input
          type="date"
          className={styles.scheduleDateInput}
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          aria-label="Filter jadwal berdasarkan hari"
        />
        <button type="button" className={styles.scheduleFilterButton} onClick={() => setSelectedDate(today)}>
          Hari ini
        </button>
        {selectedDate && (
          <button type="button" className={styles.scheduleFilterButton} onClick={() => setSelectedDate('')}>
            Semua
          </button>
        )}
      </div>

      <div className={styles.scheduleList}>
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule, index) => (
            <div key={schedule.schedule_id || index} className={styles.scheduleCard}>
              <div className={styles.scheduleTime}>
                <Clock size={14} />
                <span>
                  {formatLocalDate(schedule.tanggal_dimulai, true)} - {formatLocalTime(schedule.tanggal_dimulai)} - {formatLocalTime(schedule.tanggal_selesai)}
                </span>
              </div>
              <h3 className={styles.scheduleEventName}>{schedule.schedule_name}</h3>
            </div>
          ))
        ) : (
          <div className={styles.emptySchedule}>
            <CalendarDays size={36} />
            <p>{selectedDate ? 'Tidak ada jadwal pada hari ini' : 'Belum ada jadwal untuk ruangan ini'}</p>
          </div>
        )}
      </div>
    </>
  );
}
