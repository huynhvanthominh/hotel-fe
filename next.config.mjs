/** @type {import('next').NextConfig} */
// use url other domain in development
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
