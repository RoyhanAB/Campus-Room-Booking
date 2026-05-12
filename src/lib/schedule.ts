import { supabase } from './supabase';
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