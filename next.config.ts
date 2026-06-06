import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-1792355306b94698bf754cde766762fb.r2.dev",
        port: "",
      },
    ],
  },
};

export default nextConfig;
