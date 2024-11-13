import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    dirs:['src/app']
  },
  sassOptions: {
    // implementation: 'sass-embedded',
  },
};

export default nextConfig;
