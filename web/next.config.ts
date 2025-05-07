import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals = [...config.externals, '@uploadcare/upload-client'];
    return config;
  },
};

export default (withFlowbiteReact(nextConfig));