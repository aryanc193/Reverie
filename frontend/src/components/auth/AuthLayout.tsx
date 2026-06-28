import Head from "next/head";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "@/styles/Auth.module.css";

interface AuthLayoutProps {
  title: string;
  tagline: string;
  children: ReactNode;
}

export default function AuthLayout({ title, tagline, children }: AuthLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} — Reverie</title>
        <meta name="description" content="Your reflective journaling companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.shell}>
        <div className={styles.formColumn}>
          <div className={styles.formInner}>
            <h1 className={styles.logo}>Reverie</h1>
            <p className={styles.tagline}>{tagline}</p>
            {children}
          </div>
        </div>

        <aside className={styles.heroColumn} aria-hidden>
          <Image
            src="/auth/hero.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </aside>
      </div>
    </>
  );
}
