import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicUser } from "@/lib/api/auth";
import styles from "@/styles/Dashboard.module.css";

interface UserBadgeProps {
  user: PublicUser;
}

function formatRole(role: string) {
  if (role === "user") return "member";
  return role;
}

export default function UserBadge({ user }: UserBadgeProps) {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      className={styles.userBadge}
      onClick={() => void logout()}
      aria-label={`Signed in as ${user.username}. Click to sign out.`}
      title="Sign out"
    >
      <Image
        src="/dashboard/avatar.png"
        alt=""
        width={60}
        height={60}
        className={styles.avatar}
      />
      <div className={styles.userText}>
        <p className={styles.userName}>{user.username}</p>
        <p className={styles.userPlan}>{formatRole(user.role)}</p>
      </div>
    </button>
  );
}
