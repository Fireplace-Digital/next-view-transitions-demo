/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'picsum.photos',
      protocol: 'https',
      pathname: "**"
    }]
  },
};

export default nextConfig;
