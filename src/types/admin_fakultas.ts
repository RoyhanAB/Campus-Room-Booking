export interface AdminFakultasJoined {
  user_id: string;
  user: {
    user_name: string;
  } | null; 
  fakultas: {
    fakultas_name: string;
  } | null;
}