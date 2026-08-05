import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // Enable MDX support for .md and .mdx files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Strict mode for React 19
  reactStrictMode: true,

  // Experimental: enable typed routes
  experimental: {
    typedRoutes: true,
  },
};

export default withMDX(nextConfig);
