import styles from "./adminSidebar.module.scss";
import Link from "next/link";
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
          <Link href={ROUTES.gallery} className={styles.sidebar__link}>
            Gallery
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.category} className={styles.sidebar__link}>
            Category
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.tag} className={styles.sidebar__link}>
            Tag
          </Link>
        </li>
        <li className={styles.sidebar__list}>
          <Link href={ROUTES.article} className={styles.sidebar__link}>
            Article
          </Link>
        </li>
      </ol>
    </aside>
  );
}
