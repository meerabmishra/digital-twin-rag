/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['chromadb'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve these modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    // Mark chromadb as external for client-side
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push('chromadb');
    }
    return config;
  },
};

module.exports = nextConfig;
