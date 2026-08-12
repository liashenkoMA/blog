import SidebarComponent from "../SidebarComponent/SidebarComponent";
import styles from "./sidebarList.module.scss";

interface ISidebarListItem {
  _id: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
}

interface ISidebarListProps {
  title: string;
  sidebarData: ISidebarListItem[];
}

export default function SidebarList({ title, sidebarData }: ISidebarListProps) {
  return (
    <section className={styles.sidebarList}>
      <div className={styles.sidebarList__category}>
        <h2 className={styles.sidebarList__title}>{title}</h2>
        <ul className={styles.sidebarList__lists}>
          {sidebarData.map((item) => (
            <SidebarComponent key={item._id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
