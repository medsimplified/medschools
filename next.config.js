/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Pin tracing to the workspace to avoid picking up parent lockfiles
  outputFileTracingRoot: __dirname,

  productionBrowserSourceMaps: false,

  // Performance optimizations for Render
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Increase timeout for Render's free tier
  staticPageGenerationTimeout: 180,
  
  // ✅ Let builds succeed even if there are TypeScript / ESLint errors (for now)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'react-icons',
      'framer-motion',
      'react-slick',
      'react-player',
    ],
    // CSS optimization causes build errors, disabled for now
    // optimizeCss: true,
  },

  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Prevent bundling server-only modules on client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        net: false,
        tls: false,
      };

      // Better code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // React/Next chunks
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'react-vendors',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }

    // Ignore native .node files
    config.module.rules.push({
      test: /\.node$/,
      use: "ignore-loader",
    });

    return config;
  },

  // For Next.js 15+ (ensures canvas stays externalized)
  serverExternalPackages: ["canvas"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dnycwq6ad/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    // Image optimization with longer cache for Render
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for Render CDN
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Static assets - long cache
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes - short cache with revalidation
      {
        source: '/api/courses/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
