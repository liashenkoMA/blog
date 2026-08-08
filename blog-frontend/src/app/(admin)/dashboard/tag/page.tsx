import styles from "./tag.module.scss";
import { ITagResponse } from "@/_interfaces/interfaces";
import AdminTagForm from "@/_components/AdminTagForm/AdminTagForm";
import { getTags } from "@/_utils/server/tagApi";

export default async function Page() {
  const tags: ITagResponse[] = await getTags();

  return (
    <section className={styles.tag}>
      <div className={styles.tag__conteiner}>
        <h1 className={styles.tag__title}>Тэг</h1>
        <AdminTagForm />
        <div className={styles.tag__lists}>
          {tags.map((el) => (
            <div key={el._id} className={styles.tag__list}>
              <p className={styles.tag__text}>{el.slug}</p>
              <p className={styles.tag__text}>{el.name}</p>
              <p className={styles.tag__text}>{el.title}</p>
              <p className={styles.tag__text}>{el.description}</p>
              <p className={styles.tag__text}>{el.image}</p>
              <p className={styles.tag__text}>{el.imageAlt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
