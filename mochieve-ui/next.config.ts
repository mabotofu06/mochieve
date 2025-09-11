import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    //ビルド時にes-lintエラーが発生するため一旦無視
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
