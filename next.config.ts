import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "barchasb-admin-server.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
