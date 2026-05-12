import styles from './skeleton.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={`${styles.shine} ${styles.searchBar}`} />
      <div className={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`${styles.shine} ${styles.card}`} />
        ))}
      </div>
    </div>
  );
}
