/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Vercel handles this automatically; disabled locally for Windows symlink permissions
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:3001/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
