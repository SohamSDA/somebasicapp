/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'], // Add any other image domains you need
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig; 