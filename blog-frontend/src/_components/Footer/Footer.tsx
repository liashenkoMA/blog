import Socials from "../Socials/Socials";
import style from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footer__content}>
        <p className={style.footer__copyright}>
          © 2026 Created by
          <span className={style.footer__copyright_type_colored}>
            {" "}
            LyashenkoMA
          </span>
        </p>
        <Socials />
      </div>
    </footer>
  );
}
