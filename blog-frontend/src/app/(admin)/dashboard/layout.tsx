import styles from "./dashboardLayout.module.scss";
import AdminSidebar from "@/_components/AdminSidebar/AdminSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
