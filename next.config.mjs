/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://studypod.click/api',
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
