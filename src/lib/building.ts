import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import { Building } from '../types/building';

// ===================== READ =====================

export const getAllBuildingsWithFakultas = async (): Promise<(Building & { fakultas_name?: string })[]> => {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      *,
      fakultas:fakultas_id (fakultas_name)
    `)
    .order('building_name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    throw new Error(error.message);
  }

  type BuildingJoined = Building & {
    fakultas?: { fakultas_name?: string | null } | null;
  };

  return ((data ?? []) as BuildingJoined[]).map((b) => ({
    ...b,
    fakultas_name: b.fakultas?.fakultas_name || undefined,
    fakultas: undefined,
  }));
};

export const getBuildingById = async (id: number): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('building_id', id)
    .single();

  if (error) {
    console.error('Error fetching building:', error);
    return null;
  }

  return data as Building;
};

// ===================== CREATE =====================

export const createBuilding = async (payload: {
  fakultas_id: number;
  building_name: string;
  floor: number;
}): Promise<Building> => {
  const { data, error } = await supabaseAdmin
    .from('buildings')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating building:', error);
    throw new Error(error.message);
  }

  return data as Building;
};

// ===================== UPDATE =====================

export const updateBuilding = async (
  id: number,
  payload: Partial<Omit<Building, 'building_id'>>
): Promise<Building> => {
  const { data, error } = await supabaseAdmin
    .from('buildings')
    .update(payload)
    .eq('building_id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating building:', error);
    throw new Error(error.message);
  }

  return data as Building;
};

// ===================== DELETE =====================

export const deleteBuilding = async (id: number): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('buildings')
    .delete()
    .eq('building_id', id);

  if (error) {
    console.error('Error deleting building:', error);
    throw new Error(error.message);
  }
};
