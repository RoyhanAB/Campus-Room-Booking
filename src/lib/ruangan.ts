import { supabase } from './supabase';
import { Room } from '../types/room';

export const getRoomsLimit15 = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('ruangan')
    .select('*')
    .limit(15);
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw new Error(error.message);
  }
  
  return data as Room[];
};

export const detailroom = async (roomId: string): Promise<Room> => {
  const { data: room, error: roomError } = await supabase
    .from('ruangan')
    .select('*')
    .eq('room_id', roomId)
    .single();

  if (roomError) {
    console.error('Error fetching room:', roomError);
    throw new Error(roomError.message);
  }

  return room as Room;
};
