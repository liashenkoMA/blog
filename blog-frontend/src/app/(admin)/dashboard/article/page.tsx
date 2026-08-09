import { getCategories } from "@/_utils/server/categoryApi";
import styles from "./article.module.scss";
import AdminArticleForm from "@/_components/AdminArticleForm/AdminArticleForm";
import { getTags } from "@/_utils/server/tagApi";

export default async function Page() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <section className={styles.article}>
      <div className={styles.article__conteiner}>
        <h1 className={styles.article__title}>Статья</h1>
        <AdminArticleForm categories={categories} tags={tags} />
      </div>
    </section>
  );
}
