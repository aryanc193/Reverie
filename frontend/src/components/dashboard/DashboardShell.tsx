import Head from "next/head";
import Image from "next/image";
import type { ReactNode } from "react";
import type { PublicUser } from "@/lib/api/auth";
import Sidebar from "./Sidebar";
import UserBadge from "./UserBadge";
import styles from "@/styles/Dashboard.module.css";

interface DashboardShellProps {
  user: PublicUser;
  children: ReactNode;
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <>
      <Head>
        <title>Reverie</title>
        <meta name="description" content="Your reflective journaling companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.shell}>
        <div className={styles.frame}>
          <div className={styles.main}>
            <div className={styles.bgLayer} aria-hidden>
              <Image
                src="/dashboard/pixel-bg.png"
                alt=""
                width={529}
                height={942}
                className={styles.pixelBg}
                priority
              />
              <Image
                src="/dashboard/cloud.png"
                alt=""
                width={360}
                height={144}
                className={`${styles.cloud} ${styles.cloudTop}`}
              />
              <Image
                src="/dashboard/cloud.png"
                alt=""
                width={360}
                height={144}
                className={`${styles.cloud} ${styles.cloudMid}`}
              />
            </div>

            <header className={styles.header}>
              <h1 className={styles.logo}>Reverie</h1>
            </header>

            <div className={styles.content}>{children}</div>

            <UserBadge user={user} />
          </div>

          <Sidebar />
        </div>
      </div>
    </>
  );
}
