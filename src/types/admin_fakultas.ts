export interface AdminFakultasJoined {
  user_id: string;
  fakultas_id: number;
  user: {
    user_name: string;
  } | null; 
  fakultas: {
    fakultas_name: string;
  } | null;
}