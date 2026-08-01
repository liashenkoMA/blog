import styles from "./login.module.scss";
import LoginForm from "@/_components/LoginForm/LoginForm";

export default function Page() {
  return (
    <main className={styles.content}>
      <section className={styles.login}>
        <div className={styles.login__conteiner}>
          <h1 className={styles.login__title}>Welcome back!</h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
