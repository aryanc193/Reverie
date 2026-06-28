import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import styles from "@/styles/Dashboard.module.css";

function ChevronDown() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const [entryTitle, setEntryTitle] = useState("Untitled entry");
  const [entryBody, setEntryBody] = useState("");
  const [chatQuery, setChatQuery] = useState("");

  if (isLoading || !isAuthenticated) return null;

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
          <aside className={styles.sidebar} aria-label="Main navigation">
            <Image
              src="/dashboard/navbar.png"
              alt=""
              width={100}
              height={982}
              priority
            />
          </aside>

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
              <Image
                src="/dashboard/cloud.png"
                alt=""
                width={360}
                height={144}
                className={`${styles.cloud} ${styles.cloudBottom}`}
              />
            </div>

            <h1 className={styles.logo}>Reverie</h1>

            <div className={styles.content}>
              <section className={styles.chatPanel} aria-label="Chat with memories">
                <div className={styles.modelRow}>
                  <span className={styles.modelLabel}>Gemini Flash 2.0</span>
                  <ChevronDown />
                </div>
                <input
                  className={styles.chatInput}
                  type="text"
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="Chat with your memories..."
                  aria-label="Chat with your memories"
                />
              </section>

              <section className={styles.notePanel} aria-label="Journal entry">
                <span className={`${styles.noteDot} ${styles.noteDotLeft}`} />
                <span className={`${styles.noteDot} ${styles.noteDotRight}`} />

                <input
                  className={styles.noteTitle}
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  aria-label="Entry title"
                />
                <textarea
                  className={styles.noteBody}
                  value={entryBody}
                  onChange={(e) => setEntryBody(e.target.value)}
                  placeholder="Start writing your thoughts..."
                  aria-label="Entry content"
                />
              </section>
            </div>

            <div className={styles.userBadge}>
              <Image
                src="/dashboard/avatar.png"
                alt=""
                width={60}
                height={60}
                className={styles.avatar}
              />
              <div className={styles.userText}>
                <p className={styles.userName}>{user?.username ?? "Guest"}</p>
                <p className={styles.userPlan}>pro plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
