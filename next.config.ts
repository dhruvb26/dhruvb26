import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	// Preserve older project and wiki links under the shared /me prefix.
	// biome-ignore lint/suspicious/useAwait: Next.js requires redirects to return a Promise
	async redirects() {
		return [
			{ source: "/projects", destination: "/me/projects", permanent: true },
			{ source: "/projects/:slug", destination: "/me/projects/:slug", permanent: true },
			{ source: "/wiki", destination: "/me/wiki", permanent: true },
			{ source: "/wiki/:slug", destination: "/me/wiki/:slug", permanent: true },
			{ source: "/lab/wiki", destination: "/me/wiki", permanent: true },
			{ source: "/lab/wiki/:slug", destination: "/me/wiki/:slug", permanent: true },
		];
	},
	// Preserve the older /me home link.
	// biome-ignore lint/suspicious/useAwait: Next.js requires rewrites to return a Promise
	async rewrites() {
		return [{ source: "/me", destination: "/" }];
	},
	images: {
		remotePatterns: [{ hostname: "utfs.io" }, { hostname: "*.ufs.sh" }],
	},
};

export default nextConfig;
