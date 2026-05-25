import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["inngest", "playwright"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  // Tambahkan baris kode di bawah ini untuk menaikkan limit upload Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Menaikkan limit menjadi 10 Megabytes agar ada margin untuk multipart form data
    },
  },
};

export default nextConfig;