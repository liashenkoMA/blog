"use client";

import styles from "./navigation.module.scss";
import { ROUTES } from "@/_constants/routes.constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className={styles.navigation}>
      <button
        type="button"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className={`${styles.navigation__btn} ${
          isOpen
            ? styles.navigation__btn_type_close
            : styles.navigation__btn_type_open
        }`}
      />
      <div
        className={`${styles.navigation__container} ${
          isOpen ? styles.navigation__container_open : ""
        }`}
      >
        <ul className={styles.navigation__lists}>
          <li className={styles.navigation__list}>
            <Link
              href={ROUTES.home}
              className={`${styles.navigation__link} ${
                path === ROUTES.home ? styles.navigation__link_active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Главная
            </Link>
          </li>

          <li className={styles.navigation__list}>
            <Link
              href={ROUTES.blog}
              className={`${styles.navigation__link} ${
                path === ROUTES.blog ? styles.navigation__link_active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Блог
            </Link>
          </li>

          <li className={styles.navigation__list}>
            <Link
              href={ROUTES.aboutme}
              className={`${styles.navigation__link} ${
                path === ROUTES.aboutme ? styles.navigation__link_active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Обо мне
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
