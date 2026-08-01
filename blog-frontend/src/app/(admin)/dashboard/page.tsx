import styles from "./dashboard.module.scss";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <div className={styles.dashboard__conteiner}>
        <h1 className={styles.dashboard__title}>Dashboard</h1>
      </div>
    </section>
  );
}
