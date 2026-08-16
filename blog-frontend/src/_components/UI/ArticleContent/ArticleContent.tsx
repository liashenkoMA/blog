import ReactMarkdown from "react-markdown";
import styles from "./articleContent.module.scss";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className={styles.article}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className={styles.text}>{children}</p>,

          h1: ({ children }) => <h1 className={styles.title}>{children}</h1>,

          h2: ({ children }) => <h2 className={styles.subtitle}>{children}</h2>,

          h3: ({ children }) => (
            <h3 className={styles.subsubtitle}>{children}</h3>
          ),

          h4: ({ children }) => <h4 className={styles.heading}>{children}</h4>,

          ul: ({ children }) => <ul className={styles.list}>{children}</ul>,

          ol: ({ children }) => (
            <ol className={styles.listNumbered}>{children}</ol>
          ),

          li: ({ children }) => <li className={styles.listItem}>{children}</li>,

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

          strong: ({ children }) => (
            <strong className={styles.strong}>{children}</strong>
          ),

          em: ({ children }) => <em className={styles.italic}>{children}</em>,

          del: ({ children }) => (
            <del className={styles.deleted}>{children}</del>
          ),

          blockquote: ({ children }) => (
            <blockquote className={styles.quote}>{children}</blockquote>
          ),

          code: ({ children }) => (
            <code className={styles.inlineCode}>{children}</code>
          ),

          pre: ({ children }) => (
            <pre className={styles.codeBlock}>{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
