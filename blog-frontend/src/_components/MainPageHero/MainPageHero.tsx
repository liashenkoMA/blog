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
            Hello Everyone!
          </p>
          <h1 className={styles.mainPageHero__title}>
            I`m
            <br />
            <span
              className={`${styles.mainPageHero__title} ${styles.mainPageHero__title_type_colored}`}
            ></span>
          </h1>
          <p className={styles.mainPageHero__text}>
            Этот блог я создал в рамках работы над пет-проектами — в будущем,
            возможно, буду делиться статьями о том, как реализовывал различные
            идеи, какие технологии использовал и с какими трудностями
            сталкивался.
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
