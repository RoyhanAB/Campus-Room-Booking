import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import { Fakultas } from '../types/fakultas';

// ===================== READ =====================

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

export const getFakultasById = async (id: number): Promise<Fakultas | null> => {
  const { data, error } = await supabase
    .from('fakultas')
    .select('*')
    .eq('fakultas_id', id)
    .single();

  if (error) {
    console.error('Error fetching fakultas:', error);
    return null;
  }

  return data as Fakultas;
};

// ===================== CREATE =====================

export const createFakultas = async (payload: {
  fakultas_name: string;
  lokasi: string;
}): Promise<Fakultas> => {
  const { data, error } = await supabaseAdmin
    .from('fakultas')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating fakultas:', error);
    throw new Error(error.message);
  }

  return data as Fakultas;
};

// ===================== UPDATE =====================

export const updateFakultas = async (
  id: number,
  payload: Partial<Omit<Fakultas, 'fakultas_id'>>
): Promise<Fakultas> => {
  const { data, error } = await supabaseAdmin
    .from('fakultas')
    .update(payload)
    .eq('fakultas_id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating fakultas:', error);
    throw new Error(error.message);
  }

  return data as Fakultas;
};

// ===================== DELETE =====================

export const deleteFakultas = async (id: number): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('fakultas')
    .delete()
    .eq('fakultas_id', id);

  if (error) {
    console.error('Error deleting fakultas:', error);
    throw new Error(error.message);
  }
};
