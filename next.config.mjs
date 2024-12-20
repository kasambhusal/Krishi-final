/** @type {import('next').NextConfig} */
const nextConfig = {
  // output:"export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.krishisanjal.com", // Single hostname as a string
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com", // Another hostname as a string
      },
    ],
    unoptimized:true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  generateBuildId: () => "build",
};

export default nextConfig;
