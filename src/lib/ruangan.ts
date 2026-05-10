import { supabase } from './supabase';
import { Room } from '../types/room';
import { Building } from '../types/building';

// ===================== READ =====================

export const getRoomsLimit15 = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
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
    .from('rooms')
    .select('*')
    .eq('room_id', roomId)
    .single();

  if (roomError) {
    console.error('Error fetching room:', roomError);
    throw new Error(roomError.message);
  }

  return room as Room;
};

export const getAllBuildings = async (): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .order('building_name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    throw new Error(error.message);
  }

  return data as Building[];
};

// ===================== CREATE =====================

export const createRoom = async (payload: {
  room_id: string;
  building_id: number;
  floor: number;
  number: number;
  kapasitas: number;
  deskripsi?: string;
  foto?: string;
}): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      room_id: payload.room_id,
      building_id: payload.building_id,
      floor: payload.floor,
      number: payload.number,
      kapasitas: payload.kapasitas,
      deskripsi: payload.deskripsi || '',
      foto: payload.foto || '',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating room:', error);
    throw new Error(error.message);
  }

  return data as Room;
};

// ===================== UPDATE =====================

export const updateRoom = async (
  roomId: string,
  payload: {
    building_id?: number;
    floor?: number;
    number?: number;
    kapasitas?: number;
    deskripsi?: string;
    foto?: string;
  }
): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .update(payload)
    .eq('room_id', roomId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating room:', error);
    throw new Error(error.message);
  }

  return data as Room;
};

// ===================== DELETE =====================

export const deleteRoomById = async (roomId: string): Promise<void> => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('room_id', roomId);

  if (error) {
    console.error('Error deleting room:', error);
    throw new Error(error.message);
  }
};
