/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    hostname: ['localhost', '192.168.2.95'],
  },
  webSocketServer: {
    host: '0.0.0.0',
  }
};

module.exports = nextConfig;
