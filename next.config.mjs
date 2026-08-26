import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Emit a folder of static HTML files (out/) instead of a server runtime.
  output: 'export',
  // Export as directory-style pages (docs/index.html instead of docs.html),
  // which is the layout nginx/static hosts expect.
  trailingSlash: true,
  // next/image optimization needs a server; disable it for static hosting.
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
