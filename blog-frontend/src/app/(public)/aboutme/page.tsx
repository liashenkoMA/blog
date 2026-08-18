import Developer from "@/_components/Developer/Developer";
import styles from "./aboutme.module.scss";
import { getUser } from "@/_utils/server/userApi";
import Profile from "@/_components/Profile/Profile";
import Skills from "@/_components/Skills/Skills";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";

export default async function Page() {
  const user = await getUser();

  return (
    <main className={styles.aboutme}>
      <Developer user={user} />
      <Profile user={user} />
      <Skills />
      <ButtonUp />
    </main>
  );
}
