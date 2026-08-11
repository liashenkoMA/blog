import styles from "./mainPageLastArticleCard.module.scss";
import Image from "next/image";
import { ILastArticleResponse } from "@/_interfaces/interfaces";
import Link from "next/link";

export default function MainPageLastArticleCard({
  article,
}: {
  article: ILastArticleResponse;
}) {
  function formatDate(date: string): string {
    return new Date(date).toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <article className={styles.mainPageLastArticleCard}>
      <Link
        href={`${article.category.slug}/${article.slug}`}
        className={styles.mainPageLastArticleCard__imageLink}
      >
        <Image
          src={article.image}
          width={300}
          height={300}
          alt={article.imageAlt}
          className={styles.mainPageLastArticleCard__image}
        />
      </Link>

      <div className={styles.mainPageLastArticleCard__info}>
        <Link
          href={`${article.category.slug}`}
          className={styles.mainPageLastArticleCard__category}
        >
          {article.category.name}
        </Link>
        <Link
          href={`${article.category.slug}/${article.slug}`}
          className={styles.mainPageLastArticleCard__title}
        >
          {article.title}
        </Link>
        <p className={styles.mainPageLastArticleCard__description}>
          {article.description}
        </p>

        <div className={styles.mainPageLastArticleCard__meta}>
          <p className={styles.mainPageLastArticleCard__metaItem}>
            <span
              className={`${styles.mainPageLastArticleCard__metaIcon} ${styles.mainPageLastArticleCard__metaIcon_calendar}`}
            />
            {formatDate(article.createdAt)}
          </p>
          <p className={styles.mainPageLastArticleCard__metaItem}>
            <span
              className={`${styles.mainPageLastArticleCard__metaIcon} ${styles.mainPageLastArticleCard__metaIcon_clock}`}
            />
            {article.readingTime}
          </p>
        </div>
      </div>
    </article>
  );
}
