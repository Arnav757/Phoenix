import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHost = (() => {
  try {
    return SUPABASE_URL ? new URL(SUPABASE_URL).host : "";
  } catch {
    return "";
  }
})();

// Content-Security-Policy tuned for this project:
//   * script-src includes 'unsafe-inline' + 'unsafe-eval' because Next 16 +
//     Turbopack inject inline runtime scripts and use dynamic evaluation
//     for the framework — a nonce-based CSP would need per-request headers
//     via middleware, which is a follow-up hardening pass.
//   * style-src 'unsafe-inline' — Tailwind + shadcn ship inline <style> tags
//     and inline style attributes for animation transforms.
//   * img/media-src include data:, blob: — used by the globe (cobe emits a
//     canvas snapshot via toDataURL) and the video preloader.
//   * connect-src includes the Supabase project so the browser can hit
//     the Route Handler and (later) Realtime / Storage endpoints.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_URL} https://*.supabase.co wss://*.supabase.co`.trim(),
  // Google Maps embeds on portfolio project pages (location section).
  "frame-src 'self' https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const longCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/phoenix/:path*", headers: longCache },
      { source: "/_next/static/:path*", headers: longCache },
    ];
  },

  // The individual project pages moved from /projects/[id] into the new
  // /portfolio/[status]/[slug] tree — redirect the old URLs so existing
  // links/bookmarks/search results keep working.
  async redirects() {
    return [
      { source: "/projects/equinox", destination: "/portfolio/upcoming/equinox", permanent: true },
      { source: "/projects/aquila", destination: "/portfolio/completed/aquila", permanent: true },
    ];
  },
};

export default nextConfig;
