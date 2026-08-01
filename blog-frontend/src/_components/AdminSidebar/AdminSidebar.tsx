import Link from "next/link";
import styles from "./adminSidebar.module.scss";

export default function AdminSidebar() {
  return (
    <aside className={styles.adminSidebar}>
      <ol className={styles.adminSidebar__lists}>
        <li className={styles.adminSidebar__list}>
          <Link href={"/"} className={styles.adminSidebar__link}>
            Главная
          </Link>
        </li>
        <li className={styles.adminSidebar__list}>
          <Link href={"/"} className={styles.adminSidebar__link}>
            Профиль
          </Link>
        </li>
        <li className={styles.adminSidebar__list}>
          <Link href={"/"} className={styles.adminSidebar__link}>
            Галерея
          </Link>
        </li>
        <li className={styles.adminSidebar__list}>
          <Link href={"/"} className={styles.adminSidebar__link}>
            Загрузить статью
          </Link>
        </li>
      </ol>
    </aside>
  );
}
