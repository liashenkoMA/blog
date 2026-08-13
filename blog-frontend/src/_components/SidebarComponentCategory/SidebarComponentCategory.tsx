import styles from "./sidebarComponentCategory.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ICategoryResponse } from "@/_interfaces/interfaces";

export default function SidebarComponentCategory({
  category,
}: {
  category: ICategoryResponse;
}) {
  return (
    <li className={styles.sidebarComponentCategory}>
      <Link
        href={`/${category.slug}`}
        className={styles.sidebarComponentCategory__link}
      >
        <Image
          src={category.image}
          width={40}
          height={40}
          alt={category.imageAlt}
          className={styles.sidebarComponentCategory__image}
        />
        <p className={styles.sidebarComponentCategory__text}>{category.name}</p>
      </Link>
    </li>
  );
}
