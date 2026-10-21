/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.lakuloka.id',
      },
      {
        protocol: 'https',
        hostname: '**.lakuloka.id',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      '~lib': './src/lib',
      '~components': './src/components',
      '~contexts': './src/contexts',
      '~app': './src/app',
      '~modules': './src/modules.ts',
    },
  },
};

export default nextConfig;
