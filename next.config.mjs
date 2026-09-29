/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.salla.sa' },
      { protocol: 'https', hostname: 'cdn.files.salla.network' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};
export default nextConfig;
