import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Only trace inside your project folder
  outputFileTracingRoot: path.resolve(__dirname),

  // Exclude Windows symlinked system dirs
  outputFileTracingExcludes: {
    "*": [
      "C:/Users/LAVI/Application Data",
      "C:/Users/LAVI/Cookies",
      "C:/Users/LAVI/AppData",
      "C:/Users/LAVI/Local Settings",
    ],
  },

  images: {
    remotePatterns: [{ hostname: "**" }],
  },
};

export default nextConfig;
