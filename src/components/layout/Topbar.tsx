"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import type { UserRole } from "@/types";
import styles from "./Topbar.module.css";

const ROLE_LABEL: Record<UserRole, string> = {
  owner: "Owner",
  manager: "Property Manager",
  accountant: "Accountant",
  maintenance: "Maintenance",
};

export function Topbar({ email, role }: { email: string; role: UserRole | null }) {
  return (
    <header className={styles.topbar}>
      <div />
      <div className={styles.user}>
        <span className={styles.email}>{email}</span>
        {role && <span className={styles.role}>{ROLE_LABEL[role]}</span>}
        <button className={styles.signOut} onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
    </header>
  );
}
