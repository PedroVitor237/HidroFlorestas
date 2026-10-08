import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/reset-password", "/forgot-password", "/verify-email", "/delete-account"].map((source) => ({ source, headers: [
      { key: "Referrer-Policy", value: "no-referrer" }, { key: "Cache-Control", value: "no-store, private" }, { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ] }));
  },
};

export default nextConfig;
