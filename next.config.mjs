/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/landing',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
