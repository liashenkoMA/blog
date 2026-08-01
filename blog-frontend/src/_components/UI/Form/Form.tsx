import styles from "./form.module.scss";

interface IFormProps {
  handleSubmit: (e: React.SubmitEvent) => void;
  children: React.ReactNode;
}

export default function Form({ handleSubmit, children }: IFormProps) {
  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {children}
    </form>
  );
}
