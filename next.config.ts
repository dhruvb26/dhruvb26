import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [{ hostname: "utfs.io" }, { hostname: "*.ufs.sh" }],
	},
};

export default nextConfig;
