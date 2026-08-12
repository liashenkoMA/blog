import styles from "./sidebar.module.scss";
import { ICategoryResponse, ITagResponse } from "@/_interfaces/interfaces";
import SidebarList from "../UI/SidebarList/SidebarList";
import { getCategories } from "@/_utils/server/categoryApi";
import SidebarComponentCategory from "../SidebarComponentCategory/SidebarComponentCategory";
import SidebarComponentTag from "../SidebarComponentTag/SidebarComponentTag";
import { getTags } from "@/_utils/server/tagApi";

export default async function Sidebar() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <aside className={styles.sidebar}>
      <SidebarList<ICategoryResponse>
        title={"Categories"}
        sidebarData={categories}
        renderItem={(item) => (
          <SidebarComponentCategory key={item._id} category={item} />
        )}
      />
      <SidebarList<ITagResponse>
        title={"Tags"}
        sidebarData={tags}
        renderItem={(item) => <SidebarComponentTag key={item._id} tag={item} />}
      />
    </aside>
  );
}
