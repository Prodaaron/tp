import styles from "./PagePlaceholder.module.css";

export function PagePlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.card}>
        <p>{note}</p>
      </div>
    </div>
  );
}
