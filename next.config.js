/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT || 3001,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.PORT || 3001}/api/:path*`,
      },
    ]
  },
  // Enable static optimization
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['images.unsplash.com'], // Add any image domains you use
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Minimize JavaScript in production
  swcMinify: true,

  // Experimental features for better performance
  experimental: {
    // Enable server actions
    serverActions: true,
    // Optimize packages
    optimizeCss: true,
    // Enable modern JavaScript features
    esmExternals: true,
  },

  // Configure webpack for development performance
  webpack: (config, { dev, isServer }) => {
    // Optimize development performance
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
