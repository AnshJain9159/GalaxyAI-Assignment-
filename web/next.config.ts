import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextVideo(withFlowbiteReact(nextConfig), { folder: 'vid' });