import styles from "./sidebar.module.scss";
import SidebarList from "../UI/SidebarList/SidebarList";
import { getCategories } from "@/_utils/server/categoryApi";
import { getTags } from "@/_utils/server/tagApi";
import SidebarComponentCategory from "../SidebarComponentCategory/SidebarComponentCategory";
import SidebarComponentTag from "../SidebarComponentTag/SidebarComponentTag";

export default async function Sidebar() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <aside className={styles.sidebar}>
      <SidebarList title={"Категории"}>
        {categories.map((cat) => (
          <SidebarComponentCategory key={cat._id} category={cat} />
        ))}
      </SidebarList>
      <SidebarList title={"Тэги"}>
        {tags.map((tag) => (
          <SidebarComponentTag key={tag._id} tag={tag} />
        ))}
      </SidebarList>
    </aside>
  );
}
