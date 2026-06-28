import styles from "@/styles/Loading.module.css";

interface LoadingScreenProps {
  label?: string;
}

export default function LoadingScreen({ label = "Loading" }: LoadingScreenProps) {
  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.inner}>
        <p className={styles.logo}>Reverie</p>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
