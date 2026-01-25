import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.git',
        '**/Application Data/**',
      ],
    };
    return config;
  },
};

export default nextConfig;
