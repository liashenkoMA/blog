import ArticleCard from "@/_components/ArticleCard/ArticleCard";
import styles from "./category.module.scss";
import PageHeader from "@/_components/PageHeader/PageHeader";
import Sidebar from "@/_components/Sidebar/Sidebar";
import { ICategoryResponse, ITagResponse } from "@/_interfaces/interfaces";
import {
  getCategoryArticles,
  getTagArticles,
} from "@/_utils/server/articleApi";
import { getCategory } from "@/_utils/server/categoryApi";
import { getTag } from "@/_utils/server/tagApi";
import { notFound } from "next/navigation";
import Pagination from "@/_components/Pagination/Pagination";

async function loadCategoryOrTag(slug: string): Promise<{
  type: "category" | "tag";
  data: ICategoryResponse | ITagResponse;
}> {
  const [categoryResult, tagResult] = await Promise.allSettled([
    getCategory(slug),
    getTag(slug),
  ]);

  if (categoryResult.status === "fulfilled") {
    return { type: "category", data: categoryResult.value };
  }

  if (tagResult.status === "fulfilled") {
    return { type: "tag", data: tagResult.value };
  }

  return notFound();
}

interface IPageProps {
  params: { slug: string };
  searchParams?: { page?: string };
}

export default async function Page({ params, searchParams }: IPageProps) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const { type, data } = await loadCategoryOrTag(awaitedParams.slug);
  const page = Number(awaitedSearchParams?.page) || 1;

  const articlePage =
    type === "category"
      ? await getCategoryArticles(awaitedParams.slug, page)
      : await getTagArticles(awaitedParams.slug, page);

  return (
    <main className={styles.category}>
      <PageHeader
        url={
          type === "category"
            ? (data as ICategoryResponse).image
            : (data as ITagResponse).image
        }
        alt={
          type === "category"
            ? (data as ICategoryResponse).imageAlt
            : (data as ITagResponse).imageAlt
        }
        title={
          type === "category"
            ? (data as ICategoryResponse).title
            : (data as ITagResponse).title
        }
      />
      <div className={styles.category__container}>
        <div className={styles.category__content}>
          {articlePage.articles.length === 0 ? (
            <p className={styles.category__text}>Статей пока нет</p>
          ) : (
            <>
              {articlePage.articles.map((art) => (
                <ArticleCard key={art._id} article={art} />
              ))}
              <Pagination
                totalCount={articlePage.totalCount}
                slug={awaitedParams.slug}
              />
            </>
          )}
        </div>
        <Sidebar />
      </div>
    </main>
  );
}
