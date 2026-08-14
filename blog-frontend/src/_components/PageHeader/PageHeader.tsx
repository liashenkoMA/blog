import styles from "./pageHeader.module.scss";
import Image from "next/image";

interface IPageHeaderProps {
  url: string;
  alt: string;
  title: string;
}

export default function PageHeader({ url, alt, title }: IPageHeaderProps) {
  return (
    <section className={styles.pageHeader}>
      <div className={styles.pageHeader__container}>
        <Image
          src={url}
          width={211}
          height={211}
          alt={alt}
          className={styles.pageHeader__image}
        />
        <div className={styles.pageHeader__content}>
          <p className={styles.pageHeader__text}>Hello Everyone!</p>
          <h1 className={styles.pageHeader__title}>{title}</h1>
        </div>
      </div>
    </section>
  );
}
