import styles from "./socials.module.scss";
import { getUser } from "@/_utils/server/userApi";
import Link from "next/link";

export default async function Socials() {
  const user = await getUser();

  return (
    <ul className={styles.socials}>
      <li className={styles.socials__item}>
        <Link href={user.telegram} className={styles.socials__link}>
          <span
            className={`${styles.socials__icon} ${styles.socials__icon_telegram}`}
          />
          Telegram
        </Link>
      </li>
      <li className={styles.socials__item}>
        <Link href={user.vk} className={styles.socials__link}>
          <span
            className={`${styles.socials__icon} ${styles.socials__icon_vk}`}
          />
          Вконтакте
        </Link>
      </li>
      <li className={styles.socials__item}>
        <Link href={user.gitHub} className={styles.socials__link}>
          <span
            className={`${styles.socials__icon} ${styles.socials__icon_github}`}
          />
          GitHub
        </Link>
      </li>
    </ul>
  );
}
