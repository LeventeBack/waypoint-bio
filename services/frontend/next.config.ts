import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker runtime stage.
  output: "standalone",
  images: {
    // Avatars are arbitrary user-provided URLs, so the optimizer cannot allowlist them
    unoptimized: true,
  },
};

export default nextConfig;
