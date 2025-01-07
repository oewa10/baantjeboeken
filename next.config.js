/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT || "3001",
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.PORT || "3001"}/api/:path*`,
      },
    ]
  },
  reactStrictMode: true,
  
  images: {
    domains: ['images.unsplash.com'], 
    unoptimized: process.env.NODE_ENV === 'development',
  },

  swcMinify: true,

  experimental: {
    optimizeCss: true,
    esmExternals: true,
  },

  webpack: (config, { dev, isServer }) => {
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
