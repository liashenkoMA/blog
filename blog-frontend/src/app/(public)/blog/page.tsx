import styles from "./blog.module.scss";
import PageHeader from "@/_components/PageHeader/PageHeader";
import Sidebar from "@/_components/Sidebar/Sidebar";
import { getUser } from "@/_utils/server/userApi";
import { getArticles } from "@/_utils/server/articleApi";
import ArticleCard from "@/_components/ArticleCard/ArticleCard";
import Pagination from "@/_components/Pagination/Pagination";

interface ISearchParams {
  searchParams?: { page?: string };
}

export default async function Page({ searchParams }: ISearchParams) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams?.page) || 1;
  const [articles, user] = await Promise.all([getArticles(page), getUser()]);

  return (
    <main className={styles.blog}>
      <PageHeader
        url={user.avatarLink}
        alt="Моя аватарка"
        title="Статьи моего блога"
      />
      <div className={styles.blog__container}>
        <div className={styles.blog__content}>
          {articles.articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
          <Pagination totalCount={articles.totalCount} slug="/blog" />
        </div>
        <Sidebar />
      </div>
    </main>
  );
}
