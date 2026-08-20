"use client";

import styles from "./pagination.module.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  totalCount,
  slug,
}: {
  totalCount: number;
  slug: string;
}) {
  const searchParams = useSearchParams();
  const count = Number(searchParams.get("page")) || 1;
  const pages = Math.ceil(totalCount / 6);
  const countPages = Array.from(Array(pages).keys());

  function filterElement(el: number): boolean {
    if (count < 4) {
      return el > 0 && el <= 3;
    } else if (count === pages - 1) {
      return el > count - 4 && el < pages - 1;
    } else if (count === pages) {
      return el > count - 4 && el < pages - 1;
    } else {
      return el > count - 3 && el < count + 1;
    }
  }

  if (pages <= 1) return null;

  return (
    <nav className={styles.pagination}>
      <ul className={styles.pagination__lists}>
        {count === 1 ? (
          <li className={styles.pagination__list}>
            <button
              type="button"
              disabled
              aria-label="Предыдущая страница"
              className={`${styles.pagination__button}`}
            >
              <span
                className={`${styles.pagination__icon} ${styles.pagination__icon_left}`}
              />
            </button>
          </li>
        ) : (
          <li className={styles.pagination__list}>
            <Link
              aria-label="Предыдущая страница"
              href={count === 2 ? slug : `${slug}?page=${count - 1}`}
              className={`${styles.pagination__button} ${styles.pagination__button_left}`}
            >
              <span
                className={`${styles.pagination__icon} ${styles.pagination__icon_left}`}
              />
            </Link>
          </li>
        )}

        {pages <= 5 ? (
          countPages.map((el) => (
            <li key={el} className={styles.pagination__list}>
              <Link
                href={el === 0 ? slug : `${slug}?page=${el + 1}`}
                className={`${styles.pagination__button} ${
                  el + 1 === count ? styles.pagination__button_type_active : ""
                }`}
              >
                {el + 1}
              </Link>
            </li>
          ))
        ) : (
          <>
            <li className={styles.pagination__list}>
              <Link
                href={slug}
                className={`${styles.pagination__button} ${
                  count === 1 ? styles.pagination__button_type_active : ""
                }`}
              >
                1
              </Link>
            </li>

            {count > 3 && (
              <li className={styles.pagination__list}>
                <p className={styles.pagination__text}>. . .</p>
              </li>
            )}

            {countPages.filter(filterElement).map((el) => (
              <li key={el} className={styles.pagination__list}>
                <Link
                  href={`${slug}?page=${el + 1}`}
                  className={`${styles.pagination__button} ${
                    el + 1 === count
                      ? styles.pagination__button_type_active
                      : ""
                  }`}
                >
                  {el + 1}
                </Link>
              </li>
            ))}
          </>
        )}

        {pages > 5 && (
          <>
            {count < pages - 2 && (
              <li className={styles.pagination__list}>
                <p className={styles.pagination__text}>. . .</p>
              </li>
            )}

            <li className={styles.pagination__list}>
              <Link
                href={`${slug}?page=${pages}`}
                className={`${styles.pagination__button} ${
                  count === pages ? styles.pagination__button_type_active : ""
                }`}
              >
                {pages}
              </Link>
            </li>
          </>
        )}

        {count === pages ? (
          <li className={styles.pagination__list}>
            <button
              type="button"
              disabled
              aria-label="Следующая страница"
              className={`${styles.pagination__button}`}
            >
              <span
                className={`${styles.pagination__icon} ${styles.pagination__icon_right}`}
              />
            </button>
          </li>
        ) : (
          <li className={styles.pagination__list}>
            <Link
              href={`${slug}?page=${count + 1}`}
              className={`${styles.pagination__button}`}
              aria-label="Следующая страница"
            >
              <span
                className={`${styles.pagination__icon} ${styles.pagination__icon_right}`}
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
