import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import { Schedule } from '../types/schedule';

export const getScheduleByRoomId = async (roomId: string): Promise<Schedule[]> => {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('room_id', roomId)
    .order('tanggal_dimulai', { ascending: true });

  if (error) {
    console.error(`Error fetching schedule for room ${roomId}:`, error);
    throw new Error(error.message);
  }
  
  return data as Schedule[];
};

// Check if there's a schedule conflict for a room at a given time range
export const checkScheduleConflict = async (
  roomId: string,
  startTime: string,
  endTime: string
): Promise<{ hasConflict: boolean; conflictingSchedules: Schedule[] }> => {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('room_id', roomId)
    .lt('tanggal_dimulai', endTime)
    .gt('tanggal_selesai', startTime);

  if (error) {
    console.error('Error checking schedule conflict:', error);
    return { hasConflict: false, conflictingSchedules: [] };
  }

  return {
    hasConflict: (data?.length ?? 0) > 0,
    conflictingSchedules: (data ?? []) as Schedule[],
  };
};

export const createScheduleFromPeminjaman = async (
  roomId: string,
  userId: string,
  scheduleName: string,
  tanggalDimulai: string,
  tanggalSelesai: string
): Promise<Schedule> => {
  const { data, error } = await supabase
    .from('schedules')
    .insert({
      room_id: roomId,
      user_id: userId,
      schedule_name: scheduleName,
      tanggal_dimulai: tanggalDimulai,
      tanggal_selesai: tanggalSelesai,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating schedule:', error);
    throw new Error(error.message);
  }

  return data as Schedule;
};

// Delete schedule by room, start time and end time (for cancellation/rejection)
export const deleteScheduleByDetails = async (
  roomId: string,
  tanggalDimulai: string,
  tanggalSelesai: string
): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('schedules')
    .delete()
    .eq('room_id', roomId)
    .eq('tanggal_dimulai', tanggalDimulai)
    .eq('tanggal_selesai', tanggalSelesai);

  if (error) {
    console.error('Error deleting schedule:', error);
    throw new Error(error.message);
  }
};