import styles from './skeleton.module.css';

export default function Loading() {
  return (
    <div className={styles.detailContainer}>
      <div className={`${styles.shine} ${styles.subtitleBlock}`} style={{ width: 80, marginBottom: '1.25rem' }} />
      <div className={`${styles.shine} ${styles.titleBlock}`} />
      <div className={`${styles.shine} ${styles.subtitleBlock}`} />
      <div className={styles.infoGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${styles.shine} ${styles.infoCard}`} />
        ))}
      </div>
      <div className={`${styles.shine} ${styles.sectionBlock}`} />
      <div className={styles.actionRow}>
        <div className={`${styles.shine} ${styles.btnBlock}`} />
        <div className={`${styles.shine} ${styles.btnBlock}`} />
      </div>
    </div>
  );
}
