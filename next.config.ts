import type { NextConfig } from "next";

// Firebase Auth + Firestore call these domains from the browser. Analytics
// (guarded, browser-only) additionally reports to the google-analytics
// domains. If you add ImageKit or another provider later, its domain needs
// adding to img-src/connect-src here too.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-src 'self' https://*.firebaseapp.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Report-only: logs violations to the browser console instead of
          // blocking requests. Switch to "Content-Security-Policy" (drop
          // "-Report-Only") once you've confirmed sign-in and Firestore
          // reads/writes work cleanly with no console warnings.
          { key: "Content-Security-Policy-Report-Only", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
