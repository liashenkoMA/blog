import styles from "./developer.module.scss";
import { IUser } from "@/_interfaces/interfaces";
import Image from "next/image";
import Link from "next/link";

export default function Developer({ user }: { user: IUser }) {
  return (
    <section className={styles.developer}>
      <div className={styles.developer__container}>
        <h1 className={styles.developer__title}>Developer</h1>
        <div className={styles.developer__content}>
          <div className={styles.developer__profile}>
            <Image
              src={user.avatarLink}
              alt="Моя аватарка"
              width={110}
              height={110}
              className={styles.developer__avatar}
            />
            <h2 className={styles.developer__name}>{user.name}</h2>
            <span className={styles.developer__profession}>
              Full-stack Developer
            </span>
            <ul className={styles.developer__lists}>
              <li className={styles.developer__list}>
                <span
                  className={`${styles.developer__icon} ${styles.developer__icon_email}`}
                  aria-hidden="true"
                />
                {user.email}
              </li>
              <li className={styles.developer__list}>
                <span
                  className={`${styles.developer__icon} ${styles.developer__icon_geo}`}
                  aria-hidden="true"
                />
                Samara
              </li>
              <li className={styles.developer__list}>
                <span
                  className={`${styles.developer__icon} ${styles.developer__icon_worktime}`}
                  aria-hidden="true"
                />
                full-time
              </li>
              <li className={styles.developer__list}>
                <span
                  className={`${styles.developer__icon} ${styles.developer__icon_link}`}
                  aria-hidden="true"
                />
                {user.mySite}
              </li>
            </ul>
            <ul className={styles.developer__technologies}>
              <li className={styles.developer__technology}>HTML</li>
              <li className={styles.developer__technology}>CSS</li>
              <li className={styles.developer__technology}>SASS</li>
              <li className={styles.developer__technology}>JS</li>
              <li className={styles.developer__technology}>TS</li>
              <li className={styles.developer__technology}>REACT</li>
              <li className={styles.developer__technology}>NODE</li>
              <li className={styles.developer__technology}>NOSQL</li>
            </ul>
          </div>

          <div className={styles.developer__info}>
            <div className={styles.developer__intro}>
              <span className={styles.developer__htmlTag}>&lt;h1&gt;</span>
              <p className={styles.developer__text}>Привет!</p>
              <p className={styles.developer__text}>
                Меня зовут{" "}
                <span className={styles.developer__animatedName}></span>
              </p>
              <p className={styles.developer__text}>
                Я начинающий Full-Stack Developer.
              </p>
              <span className={styles.developer__htmlTag}>&lt;/h1&gt;</span>
            </div>

            <div className={styles.developer__description}>
              <span className={styles.developer__htmlTag}>&lt;p&gt;</span>
              <p className={styles.developer__text}>
                Этот блог я создал в рамках работы над пет-проектами — в
                будущем, возможно, буду делиться статьями о том, как
                реализовывал различные идеи, какие технологии использовал и с
                какими трудностями сталкивался.
              </p>
              <span className={styles.developer__htmlTag}>&lt;/p&gt;</span>
            </div>

            <Link
              href="#contact__title"
              className={styles.developer__contactLink}
            >
              <span className={styles.developer__contactLinkText}>
                Let`s Talk
              </span>
              <span
                className={styles.developer__contactLinkIcon}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
