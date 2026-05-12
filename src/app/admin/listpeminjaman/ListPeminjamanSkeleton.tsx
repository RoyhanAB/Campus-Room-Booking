import styles from './ListPeminjaman.module.css';
import skeletonStyles from './ListPeminjamanSkeleton.module.css';

export default function ListPeminjamanSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={`${skeletonStyles.shine} ${skeletonStyles.titleBar}`} />
        <div className={`${skeletonStyles.shine} ${skeletonStyles.searchBar}`} />
      </div>
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['Nama Kegiatan','Ruangan','User ID','Tanggal','Status','Aksi'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j}>
                    <div className={`${skeletonStyles.shine} ${skeletonStyles.cell}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
