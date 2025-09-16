/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["*"] }
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint during build
  },
};
export default nextConfig;
