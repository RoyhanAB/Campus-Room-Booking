import styles from './HomeAdmin.module.css';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { getSession } from '@/lib/auth';

export const revalidate = 0;

export default async function AdminHomePage() {
  const session = await getSession();
  const currentUserId = session?.user_id || '';

  const adminInfo = await getAdminInfo(currentUserId);

  const userName = adminInfo?.user?.user_name || session?.user_name || 'Admin';
  const facultyName = adminInfo?.fakultas?.fakultas_name || 'Fakultas Tidak Diketahui';

  return (
    <div className={styles.container}>
      <h2 className={styles.welcomeText}>
        Selamat Datang, {userName}
      </h2>

      <h1 className={styles.facultyName}>
        Admin {facultyName}
      </h1>

      <div className={styles.divider}></div>
    </div>
  );
}