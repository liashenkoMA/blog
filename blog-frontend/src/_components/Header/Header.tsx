import styles from "./header.module.scss";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import Socials from "../Socials/Socials";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Logo />
        <Navigation />
        <div className={styles.header__socials}>
          <Socials />
        </div>
      </div>
    </header>
  );
}
