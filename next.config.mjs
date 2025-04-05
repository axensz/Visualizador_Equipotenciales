let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    userConfig = await import('./v0-user-next.config');
  } catch (innerError) {
    // Ignore if not found
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Visualizador_Equipotenciales',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? '/Visualizador_Equipotenciales/' 
    : undefined,
  
  // Error handling
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // Image handling
  images: { 
    unoptimized: true,
    // Optional: if using external image provider
    // loader: 'custom',
    // loaderFile: './image-loader.js',
  },
  
  // Build optimizations
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  
  // Optional: Generate a sitemap automatically
  generateBuildId: async () => 'build-' + Date.now(),
};

// Merge user config if exists
if (userConfig) {
  const config = userConfig.default || userConfig;
  Object.keys(config).forEach(key => {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...config[key] };
    } else {
      nextConfig[key] = config[key];
    }
  });
}

export default nextConfig;