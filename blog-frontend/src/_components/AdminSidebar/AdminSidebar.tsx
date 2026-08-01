import Link from "next/link";
import styles from "./adminSidebar.module.scss";
import { ROUTES } from "@/_constants/routes.constant";

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <ol className={styles.sidebar__lists}>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.home} className={styles.sidebar__link}>
            Main
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.dashboard} className={styles.sidebar__link}>
            Dashboard
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.profile} className={styles.sidebar__link}>
            Profile
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={"/"} className={styles.sidebar__link}>
            Галерея
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={"/"} className={styles.sidebar__link}>
            Загрузить статью
          </Link>
        </li>
      </ol>
    </aside>
  );
}
