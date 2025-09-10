/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Se quiser restringir ao seu "cloud name", coloque o pathname abaixo:
        // pathname: '/SEU_CLOUD_NAME/**'
      },
    ],
  },
};
export default nextConfig;
