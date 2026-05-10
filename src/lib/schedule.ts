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