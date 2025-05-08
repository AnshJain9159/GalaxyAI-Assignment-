import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://4871-2405-201-404e-1829-251f-c2ee-f6b1-2ab9.ngrok-free.app"
  ],
  
};

export default (withFlowbiteReact(nextConfig));