import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import ProfileClient from './ProfileClient';

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return <div>Silakan login</div>;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user_id)
    .single();

  return (
    <ProfileClient
      userId={session.user_id}
      userName={session.user_name}
      role={session.role}
      jurusan={profile?.jurusan || ''}
      angkatan={profile?.angkatan || ''}
    />
  );
}
