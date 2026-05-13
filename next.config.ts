import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactCompiler: false,
  serverExternalPackages: ["sharp"],
  async redirects() {
    return [
      {
        source: '/policy',
        destination: '/privacy',
        permanent: true,
      },
    ]
  },
};

export default withPayload(nextConfig);
