let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    userConfig = await import('./v0-user-next.config')
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Esto permite exportar a HTML estático (obligatorio para GitHub Pages)
  basePath: process.env.NODE_ENV === 'production' ? '/Visualizador_Equipotenciales' : '', // ✅ nombre de tu repo (ajústalo si cambia)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ Necesario para exportación estática
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

// Merge con configuración del usuario (si existe)
if (userConfig) {
  const config = userConfig.default || userConfig
  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
