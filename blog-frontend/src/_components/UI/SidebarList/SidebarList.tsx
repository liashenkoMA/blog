import styles from "./sidebarList.module.scss";
import { ReactNode } from "react";

interface ISidebarListProps<T> {
  title: string;
  sidebarData: T[];
  renderItem: (item: T) => ReactNode;
}

export default function SidebarList<T>({
  title,
  sidebarData,
  renderItem,
}: ISidebarListProps<T>) {
  return (
    <section className={styles.sidebarList}>
      <div className={styles.sidebarList__category}>
        <h2 className={styles.sidebarList__title}>{title}</h2>
        <ul className={styles.sidebarList__lists}>
          {sidebarData.map((item) => renderItem(item))}
        </ul>
      </div>
    </section>
  );
}
