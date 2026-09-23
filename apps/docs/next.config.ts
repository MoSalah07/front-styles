import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@design-eg/ui", "@design-eg/tokens"],
};

export default nextConfig;
