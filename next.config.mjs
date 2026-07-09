/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Default 75 plus the higher qualities used by the about imagery.
    qualities: [75, 92, 95]
  }
};

export default nextConfig;
