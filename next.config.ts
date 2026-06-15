import type { NextConfig } from "next";
import { UPLOAD_LIMITS } from "./src/lib/constants";

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
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fciofv2srwuutfhq.public.blob.vercel-storage.com',
      },
    ],
  },
  // Tambahkan baris kode di bawah ini untuk menaikkan limit upload Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: UPLOAD_LIMITS.SERVER_ACTIONS_BODY_SIZE, // Menaikkan limit menjadi 10 Megabytes agar ada margin untuk multipart form data
    },
  },
};

export default nextConfig;