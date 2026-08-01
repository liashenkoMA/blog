import LoginForm from "@/_components/LoginForm/LoginForm";
import styles from "./login.module.scss";

export default function Page() {
  return (
    <main className={styles.main}>
      <section className={styles.login}>
        <div className={styles.login__conteiner}>
          <h1 className={styles.login__title}>Welcome back!</h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
