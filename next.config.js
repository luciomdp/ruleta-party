/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  allowedDevOrigins: [
    'https://ruleta-party.local.dev',
  ],
  webpack: (config, { dev }) => {
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
