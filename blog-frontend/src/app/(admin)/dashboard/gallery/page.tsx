import styles from "./gallery.module.scss";
import AdminGalleryForm from "@/_components/AdminGalleryForm/AdminGalleryForm";

export default async function Page() {
  return (
    <section className={styles.gallery}>
      <div className={styles.gallery__conteiner}>
        <h1 className={styles.gallery__title}>Галлерея</h1>
        <AdminGalleryForm />
        <div className={styles.gallery__image_cards}></div>
      </div>
    </section>
  );
}
