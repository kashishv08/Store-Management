/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
    ],
  },
};

module.exports = nextConfig;
