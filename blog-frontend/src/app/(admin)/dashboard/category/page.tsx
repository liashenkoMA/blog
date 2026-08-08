import styles from "./category.module.scss";
import { getCategories } from "@/_utils/server/categoryApi";
import AdminCategoryForm from "@/_components/AdminCategoryForm/AdminCategoryForm";
import { ICategoryResponse } from "@/_interfaces/interfaces";

export default async function Page() {
  const categories: ICategoryResponse[] = await getCategories();

  return (
    <section className={styles.category}>
      <div className={styles.category__conteiner}>
        <h1 className={styles.category__title}>Категория</h1>
        <AdminCategoryForm />
        <div className={styles.category__lists}>
          {categories.map((cat) => (
            <div key={cat._id} className={styles.category__list}>
              <p className={styles.category__text}>{cat.slug}</p>
              <p className={styles.category__text}>{cat.name}</p>
              <p className={styles.category__text}>{cat.title}</p>
              <p className={styles.category__text}>{cat.description}</p>
              <p className={styles.category__text}>{cat.image}</p>
              <p className={styles.category__text}>{cat.imageAlt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
