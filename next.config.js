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
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/images/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
