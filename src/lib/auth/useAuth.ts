"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { UserRole } from "@/types";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

// Reads the caller's own /users/{uid} doc once per sign-in (not a realtime
// listener) — role changes are rare enough that a fresh sign-in/reload is an
// acceptable way to pick them up, and this keeps Firestore reads minimal.
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, role: null, loading: false });
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const role = snap.exists() ? (snap.data().role as UserRole) : null;
        setState({ user, role, loading: false });
      } catch {
        // Firestore read failed (e.g. no /users doc yet, or rules denied it) —
        // still treat them as signed in, just without a known role.
        setState({ user, role: null, loading: false });
      }
    });

    return unsubscribe;
  }, []);

  return state;
}
