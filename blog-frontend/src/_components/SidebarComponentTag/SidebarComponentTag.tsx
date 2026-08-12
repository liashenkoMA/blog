import styles from "./sidebarComponentTag.module.scss";
import { ITagResponse } from "@/_interfaces/interfaces";
import Link from "next/link";
import Image from "next/image";

export default function SidebarComponentTag({ tag }: { tag: ITagResponse }) {
  return (
    <li className={styles.sidebarComponentTag}>
      <Link href={`/${tag.slug}`} className={styles.sidebarComponentTag__link}>
        <Image
          src={tag.image}
          width={40}
          height={40}
          alt={tag.imageAlt}
          className={styles.sidebarComponentTag__image}
        />
        <p className={styles.sidebarComponentTag__text}>{tag.name}</p>
      </Link>
    </li>
  );
}
