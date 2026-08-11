import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
};

export default nextConfig;