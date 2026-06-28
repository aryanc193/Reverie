import Image from "next/image";
import type { PublicUser } from "@/lib/api/auth";
import styles from "@/styles/Dashboard.module.css";

interface UserBadgeProps {
  user: PublicUser;
}

export default function UserBadge({ user }: UserBadgeProps) {
  return (
    <div className={styles.userBadge}>
      <Image
        src="/dashboard/avatar.png"
        alt=""
        width={60}
        height={60}
        className={styles.avatar}
      />
      <div className={styles.userText}>
        <p className={styles.userName}>{user.username}</p>
        <p className={styles.userPlan}>pro plan</p>
      </div>
    </div>
  );
}
