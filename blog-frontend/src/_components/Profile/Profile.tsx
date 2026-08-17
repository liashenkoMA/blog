import styles from "./profile.module.scss";
import { IUser } from "@/_interfaces/interfaces";
import Image from "next/image";

export default async function Profile({ user }: { user: IUser }) {
  return (
    <section className={styles.profile}>
      <div className={styles.profile__content}>
        <div className={styles.profile__about}>
          <h2 className={styles.profile__title}>Обо мне</h2>
          <div className={styles.profile__description}>
            <div className={styles.profile__textContent}>
              <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
              <p className={styles.profile__text}>Всем привет!</p>
              <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>
              <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
              <p className={styles.profile__text}>
                Меня зовут Максим. Я начинающий веб-разработчик и
                специализируюсь на фронтенде, хотя немного разбираюсь и в
                бэкенде. В основном использую{" "}
                <span className={styles.profile__highlight}>Nextjs</span>, так
                как под капотом —{" "}
                <span className={styles.profile__highlight}>React</span>, а для
                бэка — <span className={styles.profile__highlight}>Nestjs</span>
                . Ну и да, по большей части я самоучка.
              </p>
              <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>
              <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
              <p className={styles.profile__text}>
                Из любимых хобби — аниме, фильмы, сериалы и активные виды
                спорта. Обожаю читать мангу и играть в настолки, кататься на
                велосипеде и плавать, ходить в походы и просто гулять по городу.
                Мечтаю хотя бы раз сыграть в DnD и подняться на Эльбрус. И да,
                как истинный любитель всего японского, в свободное время учу
                язык.
              </p>
              <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>
            </div>
          </div>
        </div>
        <Image
          src={user.avatarLink}
          alt="Моя аватарка"
          className={styles.profile__image}
          width={278}
          height={300}
          unoptimized // TODO: убрать после верстки
        />
      </div>
    </section>
  );
}
