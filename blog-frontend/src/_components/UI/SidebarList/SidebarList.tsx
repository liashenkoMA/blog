import styles from "./sidebarList.module.scss";

interface ISidebarListProps {
  title: string;
  children: React.ReactNode;
}

export default function SidebarList({ title, children }: ISidebarListProps) {
  return (
    <section className={styles.sidebarList}>
      <div className={styles.sidebarList__category}>
        <h2 className={styles.sidebarList__title}>{title}</h2>
        <ul className={styles.sidebarList__lists}>{children}</ul>
      </div>
    </section>
  );
}
