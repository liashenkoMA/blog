import styles from "./mainPageHero.module.scss";
import on from "../../_images/on.jpg";
import under from "../../_images/under.jpg";
import Image from "next/image";
import Socials from "../Socials/Socials";

export default function MainPageHero() {
  return (
    <section className={styles.mainPageHero}>
      <div className={styles.mainPageHero__container}>
        <div className={styles.mainPageHero__profile}>
          <p
            className={`${styles.mainPageHero__text} ${styles.mainPageHero__text_greeting}`}
          >
            Всем привет!
          </p>
          <h1 className={styles.mainPageHero__title}>
            Я —
            <br />
            <span
              className={`${styles.mainPageHero__title} ${styles.mainPageHero__title_type_colored}`}
            ></span>
          </h1>
          <p className={styles.mainPageHero__text}>
            Начинающий full-stack разработчик, который постоянно что-то
            придумывает, пишет и успешно ломает. Здесь буду сохранять свои
            заметки, идеи, решения и наблюдения — и просто вести дневник своего
            пути в веб-разработке.
          </p>
          <div className={styles.mainPageHero__socials}>
            <Socials />
          </div>
        </div>
        <div className={styles.mainPageHero__images}>
          <Image
            src={under}
            width={332}
            height={285}
            alt="Дополнительное фото"
            className={`${styles.mainPageHero__image} ${styles.mainPageHero__image_position_under}`}
          />
          <Image
            src={on}
            width={300}
            height={320}
            alt="Основное фото"
            className={`${styles.mainPageHero__image} ${styles.mainPageHero__image_position_on}`}
          />
        </div>
      </div>
    </section>
  );
}
