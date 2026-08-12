import styles from "./sidebar.module.scss";
import SidebarList from "../UI/SidebarList/SidebarList";
import { getCategories } from "@/_utils/server/categoryApi";
import { getTags } from "@/_utils/server/tagApi";

export default async function Sidebar() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <aside className={styles.sidebar}>
      <SidebarList title={"Categories"} sidebarData={categories} />
      <SidebarList title={"Tags"} sidebarData={tags} />
    </aside>
  );
}
