import ArticleHeader from "@/_components/ArticleHeader/ArticleHeader";
import styles from "./article.module.scss";
import Sidebar from "@/_components/Sidebar/Sidebar";
import { ArticleContent } from "@/_components/UI/ArticleContent/ArticleContent";
import { getArticle } from "@/_utils/server/articleApi";
import Image from "next/image";
import { getUser } from "@/_utils/server/userApi";

interface IPageProps {
  params: { article: string; category: string };
}

export default async function Page({ params }: IPageProps) {
  const awaitedParams = await params;
  const [article, user] = await Promise.all([
    getArticle(awaitedParams.article),
    getUser(),
  ]);

  return (
    <main className={styles.article}>
      <div className={styles.article__container}>
        <ArticleHeader article={article} user={user} />
        <div className={styles.article__body}>
          <div className={styles.article__content}>
            <Image
              src={article.image}
              width={300}
              height={200}
              alt={article.imageAlt}
              className={styles.article__image}
            />
            <ArticleContent content={article.content} />
          </div>
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
