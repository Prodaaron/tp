import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Values come from .env.local (NEXT_PUBLIC_* so they're readable in the browser).
// This is the client-side config — it's meant to be public. Firebase security is
// enforced by Firestore Security Rules, not by keeping this object secret.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // optional
};

// Fail fast with a clear message instead of a cryptic Firebase SDK error
// if .env.local is missing a value.
const required = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

for (const key of required) {
  if (!firebaseConfig[key]) {
    throw new Error(
      `Missing Firebase config value "${key}". Check that .env.local defines NEXT_PUBLIC_FIREBASE_${key
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()}.`
    );
  }
}

// getApps()/getApp() guard avoids "Firebase App named '[DEFAULT]' already exists"
// when Next.js Fast Refresh re-runs this module in dev.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Session-only persistence: signing in does not survive a browser/tab close.
// This runs client-side only — setPersistence touches browser storage APIs
// and must not execute during server rendering or the production build.
if (typeof window !== "undefined") {
  setPersistence(auth, browserSessionPersistence);
}

// Analytics uses browser-only APIs (window, indexedDB), so it must never run
// during server rendering or the production build. It's also unsupported in
// some browser contexts, hence the isSupported() check.
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };