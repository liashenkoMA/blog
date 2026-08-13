import styles from "./sidebarComponentTag.module.scss";
import { ITagResponse } from "@/_interfaces/interfaces";
import Link from "next/link";

export default function SidebarComponentTag({ tag }: { tag: ITagResponse }) {
  return (
    <li className={styles.sidebarComponentTag}>
      <Link href={`/${tag.slug}`} className={styles.sidebarComponentTag__link}>
        <p className={styles.sidebarComponentTag__text}># {tag.name}</p>
      </Link>
    </li>
  );
}
