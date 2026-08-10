import Logo from "../Logo/Logo";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Logo />
      </div>
    </header>
  );
}
