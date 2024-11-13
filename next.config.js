const nextConfig = {
  eslint: {
    dirs: ["src/app"],
  },
  sassOptions: {
    // implementation: 'sass-embedded',
  },
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
    }
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
