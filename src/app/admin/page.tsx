import styles from './HomeAdmin.module.css';
import { getAdminInfo } from '@/lib/admin_fakultas';


export const revalidate = 0;

export default async function AdminHomePage() {
  const currentUserId = 'ADM001';

  const adminInfo = await getAdminInfo(currentUserId);

  const userName = adminInfo?.user?.user_name || 'Admin';
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