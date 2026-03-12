/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // Permite carregar imagens de qualquer lugar (útil para desenvolvimento)
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // <--- AUMENTAMOS O LIMITE PARA 50MB
    },
  },
};

export default nextConfig;