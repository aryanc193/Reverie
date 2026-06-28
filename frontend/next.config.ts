import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/mantine",
  ],
};

export default nextConfig;
