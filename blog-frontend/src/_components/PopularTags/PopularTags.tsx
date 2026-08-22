import { getTags } from "@/_utils/server/tagApi";
import styles from "./popularTags.module.scss";
import TagCard from "../TagCard/TagCard";

export default async function PopularTags() {
  const tags = await getTags();

  return (
    <section className={styles.popularTags}>
      <div className={styles.popularTags__container}>
        <div className={styles.popularTags__header}>
          <h2 className={styles.popularTags__title}>Популярные тэги</h2>
          <p className={styles.popularTags__text}>
            Темы, которые чаще всего встречаются в моих заметках.
          </p>
        </div>
        <div className={styles.popularTags__content}>
          {tags.map((tag) => (
            <TagCard key={tag._id} tag={tag} />
          ))}
        </div>
      </div>
    </section>
  );
}
