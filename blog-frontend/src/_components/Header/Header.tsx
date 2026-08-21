import Logo from "../Logo/Logo";
import Socials from "../Socials/Socials";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Logo />
        <Socials />
      </div>
    </header>
  );
}
