let userConfig = undefined;
try {
  // Intentar importar ESM primero
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // Fallback a CJS
    userConfig = await import('./v0-user-next.config');
  } catch (innerError) {
    // Ignorar si no existe
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

// Mezclar configuraciones del archivo del usuario si existe
if (userConfig) {
  const config = userConfig.default || userConfig;
  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
