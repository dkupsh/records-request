import type { NextConfig } from "next";

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig : NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // required if you're using <Image>
  },
  basePath: '/records-request',
  assetPrefix: '/records-request',
};

module.exports = nextConfig;

export default nextConfig;
