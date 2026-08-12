import styles from "./page.module.scss";
import MainPageLastArticles from "@/_components/MainPageLastArticles/MainPageLastArticles";
import MainPageHero from "@/_components/MainPageHero/MainPageHero";
import { Suspense } from "react";
import PopularTags from "@/_components/PopularTags/PopularTags";

export default function Home() {
  return (
    <main className={styles.content}>
      <MainPageHero />
      <Suspense fallback={<div>Загрузка статей... (временно)</div>}>
        <MainPageLastArticles />
      </Suspense>
      <Suspense fallback={<div>Загрузка статей... (временно)</div>}>
        <PopularTags />
      </Suspense>
    </main>
  );
}
