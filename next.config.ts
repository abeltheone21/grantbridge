import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactCompiler: false,
  serverExternalPackages: ["sharp"],
};

export default withPayload(nextConfig);
