"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { useSessionGuard } from "@/lib/auth/useSessionGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import styles from "./layout.module.css";

// This redirect is a UX convenience, not the security boundary — that's
// firestore.rules. A signed-out user bounced here still can't read/write
// anything; this just sends them to the login page instead of a blank UI.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  useSessionGuard(user);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar email={user.email ?? ""} role={role} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
