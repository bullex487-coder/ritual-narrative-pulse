// ============================================================
// next.config.mjs
// Next.js configuration for Narrative Pulse
// ============================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow images from common crypto data sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc",
      },
    ],
  },

  // Future: enable experimental server actions for on-chain writes
  experimental: {
    // serverActions: true,
  },
};

export default nextConfig;
