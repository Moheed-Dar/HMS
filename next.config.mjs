/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Add this line
  productionBrowserSourceMaps: false,   // or true if you want source maps in prod (not recommended)
};

export default nextConfig;