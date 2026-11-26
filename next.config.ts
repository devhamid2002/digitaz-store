import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    agentUpgrade: "security",
  },
  // Keep native and dynamically-required packages outside the server bundle
  serverExternalPackages: ["bcrypt", "pg", "@prisma/adapter-pg"],
  // The payment route reads this file at runtime; trace it into the function
  outputFileTracingIncludes: {
    "/api/payment": ["./data/data.json"],
  },
};

export default withNextIntl(nextConfig);
