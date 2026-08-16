import { IArticleResponse, IUser } from "@/_interfaces/interfaces";
import styles from "./articleHeader.module.scss";
import Image from "next/image";

export default function ArticleHeader({
  article,
  user,
}: {
  article: IArticleResponse;
  user: IUser;
}) {
  function formatDate(date: string): string {
    return new Date(date).toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <section className={styles.articleHeader}>
      <div className={styles.articleHeader__container}>
        <h1 className={styles.articleHeader__title}>{article.h1}</h1>
        <div className={styles.articleHeader__info}>
          <div className={styles.articleHeader__author}>
            <Image
              src={user.avatarLink}
              alt="Моя аватарка"
              width={60}
              height={60}
              className={styles.articleHeader__image}
            />

            <div className={styles.articleHeader__meta}>
              <p
                className={`${styles.articleHeader__text} ${styles.articleHeader__name}`}
              >
                {user.name}
              </p>
              <time
                dateTime={article.createdAt}
                className={`${styles.articleHeader__text} ${styles.articleHeader__date}`}
              >
                <span
                  className={`${styles.articleHeader__metaIcon} ${styles.articleHeader__metaIcon_calendar}`}
                  aria-hidden="true"
                />
                {formatDate(article.createdAt)}
              </time>
            </div>
          </div>
          <div className={styles.articleHeader__share}>
            <p className={styles.articleHeader__shareText}>Telega</p>
            <p className={styles.articleHeader__shareText}>vk</p>
          </div>
        </div>
      </div>
    </section>
  );
}
