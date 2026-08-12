import styles from "./sidebarComponent.module.scss";
import Link from "next/link";
import Image from "next/image";

export interface ISidebarComponentItem {
  slug: string;
  image: string;
  imageAlt: string;
  name: string;
}

export default function SidebarComponent({
  item,
}: {
  item: ISidebarComponentItem;
}) {
  return (
    <li className={styles.sidebarComponent}>
      <Link href={`/${item.slug}`} className={styles.sidebarComponent__link}>
        <Image
          src={item.image}
          width={40}
          height={40}
          alt={item.imageAlt}
          className={styles.sidebarComponent__image}
        />
        <p className={styles.sidebarComponent__text}>{item.name}</p>
      </Link>
    </li>
  );
}
