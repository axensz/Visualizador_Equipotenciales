let userConfig = undefined;
try {
  // Try ESM import first
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // Fallback to CJS
    userConfig = await import('./v0-user-next.config');
  } catch (innerError) {
    // Ignore if not found
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Visualizador_Equipotenciales',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static exports
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Optional: Add these if you need them
  trailingSlash: true, // Helps with static hosting
  assetPrefix: '/Visualizador_Equipotenciales/', // If you need CDN support
};

// Merge with user config if exists
if (userConfig) {
  const config = userConfig.default || userConfig;
  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...config[key] };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;