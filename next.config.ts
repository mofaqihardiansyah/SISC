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
      bodySizeLimit: "5mb", // Menaikkan limit menjadi 5 Megabytes
    },
  },
};

export default nextConfig;