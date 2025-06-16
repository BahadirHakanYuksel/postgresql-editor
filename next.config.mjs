/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment optimizations
  output: "standalone",

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  // Static optimization
  trailingSlash: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
  },

  // Bundle analyzer (optional, for debugging)
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     config.optimization.splitChunks.chunks = 'all';
  //   }
  //   return config;
  // },

  // API routes optimization
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
