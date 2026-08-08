import styles from "./category.module.scss";
import AdminCategoryForm from "@/_components/AdminCategoryForm/AdminCategoryForm";

export default async function Page() {
  return (
    <section className={styles.category}>
      <div className={styles.category__conteiner}>
        <h1 className={styles.category__title}>Категория</h1>
        <AdminCategoryForm />
        <div className={styles.category__lists}>
          <p>Тут будут все категории и возможность их отредачить</p>
        </div>
      </div>
    </section>
  );
}
