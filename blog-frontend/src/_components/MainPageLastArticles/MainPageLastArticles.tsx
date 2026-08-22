import styles from "./mainPageLastArticles.module.scss";
import { getLastArticles } from "@/_utils/server/articleApi";
import ArticleCard from "../ArticleCard/ArticleCard";
import Sidebar from "../Sidebar/Sidebar";
import { Suspense } from "react";

export default async function MainPageLastArticles() {
  const lastArticles = await getLastArticles();

  return (
    <section className={styles.mainPageLastArticles}>
      <div className={styles.mainPageLastArticles__container}>
        <div className={styles.mainPageLastArticles__header}>
          <h2 className={styles.mainPageLastArticles__title}>Новые статьи</h2>
          <p className={styles.mainPageLastArticles__text}>
            Всё новое, что я изучаю, пробую и создаю.
          </p>
        </div>
        <div className={styles.mainPageLastArticles__content}>
          <div className={styles.mainPageLastArticles__lists}>
            {lastArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          <Suspense fallback={<div>Загрузка сайдбара... (Временно)</div>}>
            <Sidebar />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
