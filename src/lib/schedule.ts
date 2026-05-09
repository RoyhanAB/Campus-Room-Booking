import { supabase } from './supabase';
import { Schedule as Scedule } from '../types/schedule';

export const getSceduleByRoomId = async (roomId: string): Promise<Scedule[]> => {
  const { data: data, error: error } = await supabase
    .from('schedules')
    .select('*')
    .eq('room_id', roomId)
    .order('tanggal_dimulai', { ascending: true });

  
  if (error) {
    console.error(`Error fetching schedule for room ${roomId}:`, error);
    throw new Error(error.message);
  }
  
  return data as Scedule[];
};