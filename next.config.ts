import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Subida de imágenes desde /admin (Vercel limita el body a ~4.5MB)
    serverActions: { bodySizeLimit: "4mb" },
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);
