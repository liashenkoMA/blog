import styles from "./logo.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "../../_images/logo.svg";

export default function Logo() {
  return (
    <Link href={"/"} className={styles.logo}>
      <Image
        src={logo}
        width={58}
        height={32}
        alt="Логотип сайта"
        className={styles.logo__image}
      />
      <p className={styles.logo__text}>LyashenkoMA</p>
    </Link>
  );
}
