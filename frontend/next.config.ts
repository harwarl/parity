import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is the workspace root; ignore any lockfile further up the tree.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
