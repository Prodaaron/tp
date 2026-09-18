"use client";

import { useEffect } from "react";
import { signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { IDLE_TIMEOUT_MS, ABSOLUTE_SESSION_MS } from "./session";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

// This is a UX/convenience control, not the security boundary — a signed-out
// session still can't read/write anything Firestore rules don't allow. What
// this actually does is limit how long an unattended, unlocked browser stays
// signed in.
export function useSessionGuard(user: User | null) {
  // Idle timeout: sign out after IDLE_TIMEOUT_MS with no mouse/keyboard activity.
  useEffect(() => {
    if (!user) return;

    let idleTimer: ReturnType<typeof setTimeout>;

    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => signOut(auth), IDLE_TIMEOUT_MS);
    }

    resetIdleTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetIdleTimer);
    }

    return () => {
      clearTimeout(idleTimer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetIdleTimer);
      }
    };
  }, [user]);

  // Absolute session length: sign out ABSOLUTE_SESSION_MS after the sign-in
  // time Firebase itself recorded, regardless of activity.
  useEffect(() => {
    if (!user?.metadata.lastSignInTime) return;

    const signedInAt = new Date(user.metadata.lastSignInTime).getTime();
    const remaining = ABSOLUTE_SESSION_MS - (Date.now() - signedInAt);

    if (remaining <= 0) {
      signOut(auth);
      return;
    }

    const timer = setTimeout(() => signOut(auth), remaining);
    return () => clearTimeout(timer);
  }, [user]);
}
