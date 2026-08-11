import styles from "./page.module.scss";
import MainPageLastArticles from "@/_components/MainPageLastArticles/MainPageLastArticles";
import MainPageHero from "@/_components/MainPageHero/MainPageHero";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className={styles.content}>
      <MainPageHero />
      <Suspense fallback={<div>Загрузка (временно)</div>}>
        <MainPageLastArticles />
      </Suspense>
    </main>
  );
}
