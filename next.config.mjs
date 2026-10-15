/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The AriLLM route reads its prompt from content/*.md at runtime; make sure
  // those files ship with the serverless function on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*.md"]
  },
  images: {
    // Default 75 plus the higher qualities used by the about imagery.
    qualities: [75, 92, 95]
  }
};

export default nextConfig;
