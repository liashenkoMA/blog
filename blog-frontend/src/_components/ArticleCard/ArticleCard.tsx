import styles from "./articleCard.module.scss";
import Image from "next/image";
import { ILastArticleResponse } from "@/_interfaces/interfaces";
import Link from "next/link";

export default function ArticleCard({
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
    <article className={styles.articleCard}>
      <Link
        href={`${article.category.slug}/${article.slug}`}
        className={styles.articleCard__imageLink}
      >
        <Image
          src={article.image}
          width={300}
          height={300}
          alt={article.imageAlt}
          className={styles.articleCard__image}
          unoptimized // TODO: убрать после верстки
        />
      </Link>

      <div className={styles.articleCard__info}>
        <Link
          href={`${article.category.slug}`}
          className={styles.articleCard__category}
        >
          {article.category.name}
        </Link>

        <h2 className={styles.articleCard__title}>
          <Link
            href={`${article.category.slug}/${article.slug}`}
            className={styles.articleCard__title_link}
          >
            {article.title}
          </Link>
        </h2>

        <p className={styles.articleCard__description}>{article.description}</p>

        <div className={styles.articleCard__meta}>
          <time
            dateTime={article.createdAt}
            className={styles.articleCard__metaItem}
          >
            <span
              className={`${styles.articleCard__metaIcon} ${styles.articleCard__metaIcon_calendar}`}
              aria-hidden="true"
            />
            {formatDate(article.createdAt)}
          </time>
          <p className={styles.articleCard__metaItem}>
            <span
              className={`${styles.articleCard__metaIcon} ${styles.articleCard__metaIcon_clock}`}
              aria-hidden="true"
            />
            {article.readingTime} mins read
          </p>
        </div>
      </div>
    </article>
  );
}
