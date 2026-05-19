/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: 'https://api-staging.kotahati.id/api/v2/:path*',
      },
    ];
  },
};

export default nextConfig;
