import { supabase } from './supabase';
import { Fakultas } from '../types/fakultas';

export const getAllFakultas = async (): Promise<Fakultas[]> => {
  const { data, error } = await supabase
    .from('fakultas')
    .select('*')
    .order('fakultas_name', { ascending: true });

  if (error) {
    console.error('Error fetching fakultas:', error);
    throw new Error(error.message);
  }

  return data as Fakultas[];
};
