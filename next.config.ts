import type { NextConfig } from "next";

// Static export for GitHub Pages. Served at the ROOT of the custom domain
// (newcapitalfomento.com.br), so there is no basePath. Local dev and Vercel
// builds are unaffected (BUILD_TARGET is unset there).
const isPages = process.env.BUILD_TARGET === "pages";

const nextConfig: NextConfig = {
  // Exposed to the client so plain <img src> stays in sync with any basePath.
  // Empty now that the site is served at the custom domain root.
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
  ...(isPages
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
