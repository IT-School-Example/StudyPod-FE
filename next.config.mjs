/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 환경에 따라 API URL을 다르게 설정
    NEXT_PUBLIC_API_URL: // 'http://localhost:8080/api', // 로컬 개발 API
     'https://studypod.click/api' // 배포 환경 API (주석처리된 예시)
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
