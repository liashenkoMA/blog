import styles from "./article.module.scss";

export default async function Page() {
  return (
    <section className={styles.article}>
      <div className={styles.article__conteiner}>
        <h1 className={styles.article__title}>Статья</h1>
      </div>
    </section>
  );
}

// форма добавления категорий и апи, тесты
// форма добавления тэгов и апи, тесты
// Скорее всего вынести тэги и категории на отдельную страницу, чтобы при переходе на страницу статей по АПИ получать тэги и категории для формы. Так думаю даже удобно будет. А на страницах тэгов и категорий в будущем добавлю возможность их редактирования
// форма добавления статьи и апи и тесты