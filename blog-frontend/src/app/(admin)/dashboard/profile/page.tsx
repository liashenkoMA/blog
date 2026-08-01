import { IUser } from "@/_interfaces/interfaces";
import styles from "./profile.module.scss";
import AdminProfileForm from "@/_components/AdminProfileForm/AdminProfileForm";
import { getUser } from "@/_utils/server/userApi";

export default async function Page() {
  const user: IUser = await getUser();

  return (
    <section className={styles.profile}>
      <div className={styles.profile__conteiner}>
        <h1 className={styles.profile__title}>Профиль</h1>
        <AdminProfileForm user={user} />
      </div>
    </section>
  );
}
