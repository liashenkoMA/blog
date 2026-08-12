import styles from "./tagCard.module.scss";
import { ITagResponse } from "@/_interfaces/interfaces";
import Link from "next/link";
import Image from "next/image";

export default function TagCard({ tag }: { tag: ITagResponse }) {
  return (
    <div className={styles.tagCard}>
      <Link href={`/${tag.slug}`} className={styles.tagCard__link}>
        <Image
          src={tag.image}
          width={40}
          height={40}
          alt={tag.imageAlt}
          className={styles.tagCard__image}
        />
        <p className={styles.tagCard__text}>{tag.name}</p>
      </Link>
    </div>
  );
}
