import styles from "./profile.module.scss";
import { IUser } from "@/_interfaces/interfaces";
import Image from "next/image";

export default async function Profile({ user }: { user: IUser }) {
  return (
    <section className={styles.profile}>
      <div className={styles.profile__container}>
        <h2 className={styles.profile__title}>Обо мне</h2>
        <div className={styles.profile__content}>
          <div className={styles.profile__description}>
            <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
            <p className={styles.profile__text}>
              В разработке мне больше всего нравится процесс создания
              работающего продукта — когда фронтенд и бэкенд складываются в
              единую систему. Поэтому люблю создавать интерфейсы на{" "}
              <span className={styles.profile__highlight}>React</span> и{" "}
              <span className={styles.profile__highlight}>Next.js</span>, а
              серверную часть — на{" "}
              <span className={styles.profile__highlight}>NestJS</span>.
            </p>
            <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>

            <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
            <p className={styles.profile__text}>
              Учусь самостоятельно: придумываю свои проекты, пробую новые
              технологии, экспериментирую с разными подходами и разбираюсь с
              проблемами, которые появляются по ходу работы. Иногда что-то
              получается с первого раза, а иногда приходится сначала всё
              сломать, чтобы понять, почему оно вообще работает.
            </p>
            <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>

            <span className={styles.profile__htmlTag}>&lt;p&gt;</span>
            <p className={styles.profile__text}>
              За пределами разработки у меня тоже хватает интересов. Люблю
              аниме, фильмы, сериалы, мангу и настольные игры. Из активного —
              велосипед, спортзал, походы и просто прогулки по городу. Параллельно учу английский и планирую засесть за японский. 
            </p>
            <span className={styles.profile__htmlTag}>&lt;/p&gt;</span>
          </div>
          <Image
            src={user.avatarLink}
            alt="Моя аватарка"
            className={styles.profile__image}
            width={278}
            height={300}
          />
        </div>
      </div>
    </section>
  );
}
