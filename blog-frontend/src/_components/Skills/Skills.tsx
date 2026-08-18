import styles from "./skills.module.scss";
import Image from "next/image";

import html from "../../_images/html.png";
import css from "../../_images/css-3.png";
import js from "../../_images/js.png";
import ts from "../../_images/typescript.png";
import react from "../../_images/react.png";
import next from "../../_images/nextjs.png";
import nest from "../../_images/NestJS.svg.png";
import mongo from "../../_images/mongodb.png";

export default function Skills() {
  return (
    <section className={styles.skills}>
      <div className={styles.skills__content}>
        <h2 className={styles.skills__title}>Навыки</h2>

        <ol className={styles.skills__lists}>
          <li className={styles.skills__list}>
            <Image
              src={html}
              width={60}
              height={60}
              alt="HTML"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>HTML</h3>

            <p className={styles.skills__description}>
              Семантическая разметка веб-страниц, работа с формами, таблицами и
              доступностью интерфейсов.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={css}
              width={60}
              height={60}
              alt="CSS"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>CSS</h3>

            <p className={styles.skills__description}>
              Адаптивная и кроссбраузерная вёрстка, Flexbox, Grid, анимации и
              организация стилей с использованием SCSS.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={js}
              width={60}
              height={60}
              alt="JavaScript"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>JavaScript</h3>

            <p className={styles.skills__description}>
              Работа с современным JavaScript, асинхронным кодом, API, DOM и
              основными возможностями языка.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={ts}
              width={60}
              height={60}
              alt="TypeScript"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>TypeScript</h3>

            <p className={styles.skills__description}>
              Типизация JavaScript-кода, работа с интерфейсами, типами, generics
              и типизированными API.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={react}
              width={60}
              height={60}
              alt="React"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>React</h3>

            <p className={styles.skills__description}>
              Разработка компонентных интерфейсов, работа с состоянием, хуками,
              формами и взаимодействием с API.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={next}
              width={60}
              height={60}
              alt="Next.js"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>Next.js</h3>

            <p className={styles.skills__description}>
              Разработка веб-приложений на React с использованием App Router,
              серверных компонентов, маршрутизации и API.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={nest}
              width={60}
              height={60}
              alt="NestJS"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>NestJS</h3>

            <p className={styles.skills__description}>
              Разработка серверных приложений на Node.js, создание REST API,
              авторизация, валидация данных и работа с базой данных.
            </p>
          </li>

          <li className={styles.skills__list}>
            <Image
              src={mongo}
              width={60}
              height={60}
              alt="MongoDB"
              className={styles.skills__image}
            />

            <h3 className={styles.skills__name}>MongoDB</h3>

            <p className={styles.skills__description}>
              Работа с документами и коллекциями, проектирование схем и
              интеграция MongoDB с серверными приложениями.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
