import type { NextConfig } from "next";

// When building for GitHub Pages we emit a fully static site under a basePath.
// Local dev and Vercel builds are unaffected (BUILD_TARGET is unset there).
const isPages = process.env.BUILD_TARGET === "pages";
const repo = "nextjs-boilerplate";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export",
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
