import styles from './skeleton.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={`${styles.shine} ${styles.title}`} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`${styles.shine} ${styles.card}`} />
      ))}
    </div>
  );
}
