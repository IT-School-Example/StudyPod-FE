/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 환경에 따라 API URL을 다르게 설정
    NEXT_PUBLIC_API_URL: 'https://studypod.click/api'
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
