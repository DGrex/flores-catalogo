/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        /*protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',*/
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Genera automáticamente estas anchuras al servir cada imagen
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536],
    // Delega el resize/optimización al CDN de Cloudinary en vez de al
    // servidor de Next.js (más rápido y no consume recursos del backend).
    loader: "custom",
    loaderFile: "./lib/utils/cloudinaryLoader.ts",
  },
  // Cabeceras de seguridad aplicadas a todas las respuestas del frontend
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
