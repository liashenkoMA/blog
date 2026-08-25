import ReactMarkdown from "react-markdown";
import styles from "./articleContent.module.scss";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className={styles.article}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Текст
          p: ({ children }) => <p className={styles.text}>{children}</p>,

          // Заголовки
          h1: ({ children }) => <h1 className={styles.title}>{children}</h1>,

          h2: ({ children }) => <h2 className={styles.subtitle}>{children}</h2>,

          h3: ({ children }) => (
            <h3 className={styles.subsubtitle}>{children}</h3>
          ),

          h4: ({ children }) => <h4 className={styles.heading}>{children}</h4>,

          // Списки
          ul: ({ children }) => <ul className={styles.list}>{children}</ul>,

          ol: ({ children }) => (
            <ol className={styles.listNumbered}>{children}</ol>
          ),

          li: ({ children }) => <li className={styles.listItem}>{children}</li>,

          // Ссылки
          a: ({ children, href }) => (
            <a
              href={href}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Форматирование текста
          strong: ({ children }) => (
            <strong className={styles.strong}>{children}</strong>
          ),

          em: ({ children }) => <em className={styles.italic}>{children}</em>,

          del: ({ children }) => (
            <del className={styles.deleted}>{children}</del>
          ),

          // Цитаты
          blockquote: ({ children }) => (
            <blockquote className={styles.quote}>{children}</blockquote>
          ),

          // Код
          code: ({ children }) => (
            <code className={styles.inlineCode}>{children}</code>
          ),

          pre: ({ children }) => (
            <pre className={styles.codeBlock}>{children}</pre>
          ),

          // Изображения
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              <Image
                src={src}
                alt={alt ?? ""}
                width={300}
                height={200}
                unoptimized // УБРАТЬ КАК ЗАКОНЧУ ОФОРМЛЕНИЕ
                className={styles.image}
              />
            ) : null,

          // Разделитель
          hr: () => <hr className={styles.separator} />,

          // Перенос строки
          br: () => <br className={styles.lineBreak} />,

          // Таблицы
          table: ({ children }) => (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>{children}</table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className={styles.tableHead}>{children}</thead>
          ),

          tbody: ({ children }) => (
            <tbody className={styles.tableBody}>{children}</tbody>
          ),

          tr: ({ children }) => <tr className={styles.tableRow}>{children}</tr>,

          th: ({ children }) => (
            <th className={styles.tableHeader}>{children}</th>
          ),

          td: ({ children }) => (
            <td className={styles.tableCell}>{children}</td>
          ),

          // Checkbox в task list
          input: ({ checked, disabled, type }) => (
            <input
              type={type}
              checked={checked}
              disabled={disabled}
              readOnly
              className={styles.checkbox}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
