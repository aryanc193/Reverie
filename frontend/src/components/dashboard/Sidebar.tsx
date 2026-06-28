import type { ReactNode } from "react";
import styles from "@/styles/Dashboard.module.css";

type NavId = "home" | "journal" | "chat" | "insights";

interface NavItem {
  id: NavId;
  label: string;
  icon: ReactNode;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JournalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V6M9 18V10M14 18V13M19 18V4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "journal", label: "Journal", icon: <JournalIcon /> },
  { id: "chat", label: "Chat", icon: <ChatIcon /> },
  { id: "insights", label: "Insights", icon: <InsightsIcon /> },
];

interface SidebarProps {
  active?: NavId;
}

export default function Sidebar({ active = "home" }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <ul className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`${styles.navItem} ${active === item.id ? styles.navItemActive : ""}`}
              aria-label={item.label}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
