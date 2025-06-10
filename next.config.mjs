/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/api"
        : "https://studypod.click/api", // 배포 환경
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
