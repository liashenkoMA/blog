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
          unoptimized // TODO: убрать после верстки
        />
      </Link>

      <div className={styles.mainPageLastArticleCard__info}>
        <Link
          href={`${article.category.slug}`}
          className={styles.mainPageLastArticleCard__category}
        >
          {article.category.name}
        </Link>

        <h2 className={styles.mainPageLastArticleCard__title}>
          <Link
            href={`${article.category.slug}/${article.slug}`}
            className={styles.mainPageLastArticleCard__title_link}
          >
            {article.title}
          </Link>
        </h2>

        <p className={styles.mainPageLastArticleCard__description}>
          {article.description}
        </p>

        <div className={styles.mainPageLastArticleCard__meta}>
          <time
            dateTime={article.createdAt}
            className={styles.mainPageLastArticleCard__metaItem}
          >
            <span
              className={`${styles.mainPageLastArticleCard__metaIcon} ${styles.mainPageLastArticleCard__metaIcon_calendar}`}
              aria-hidden="true"
            />
            {formatDate(article.createdAt)}
          </time>
          <p className={styles.mainPageLastArticleCard__metaItem}>
            <span
              className={`${styles.mainPageLastArticleCard__metaIcon} ${styles.mainPageLastArticleCard__metaIcon_clock}`}
              aria-hidden="true"
            />
            {article.readingTime} mins read
          </p>
        </div>
      </div>
    </article>
  );
}
