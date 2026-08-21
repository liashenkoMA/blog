import styles from "./publicLayout.module.scss";
import Header from "@/_components/Header/Header";
import Footer from "@/_components/Footer/Footer";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.page}>
      <Header />
      {children}
      <Footer />
      <ButtonUp />
    </div>
  );
}
