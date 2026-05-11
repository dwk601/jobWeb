import type { NextConfig } from "next";

const apiOrigin = getApiOrigin();

function getApiOrigin(): string {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (url) return new URL(url).origin;
  } catch {
    // ignore malformed URLs
  }
  return "http://localhost:8001";
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
