import type { NextConfig } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001/api/v1";
const apiHost = new URL(apiUrl);

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiHost.origin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
