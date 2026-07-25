/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
        pathname: '/covers/**',
      },
      {
        protocol: 'https',
        hostname: '*.mangadex.org',
        pathname: '/data/**',
      },
      {
        protocol: 'https',
        hostname: '*.mangadex.network',
        pathname: '/data/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.readdetectiveconan.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'readdetectiveconan.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: '*.mangapill.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: '*.mangakakalot.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gmanga.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.webdcg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.toongodd.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
