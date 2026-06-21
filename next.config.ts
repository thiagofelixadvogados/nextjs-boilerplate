import type { NextConfig } from "next";

// When building for GitHub Pages we emit a fully static site under a basePath.
// Local dev and Vercel builds are unaffected (BUILD_TARGET is unset there).
const isPages = process.env.BUILD_TARGET === "pages";
const repo = "nextjs-boilerplate";
const basePath = isPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  // Exposed to the client so plain <img src> can be prefixed with the basePath.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isPages
    ? {
        output: "export",
        basePath,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
