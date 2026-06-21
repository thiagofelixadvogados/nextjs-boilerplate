// Prefixes a public asset path with the deploy basePath (e.g. /nextjs-boilerplate
// on GitHub Pages). Empty locally and on Vercel. Use for plain <img src> since
// Next only auto-prefixes next/link and next/image, not raw <img> tags.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path: string) => `${BASE}${path}`;
