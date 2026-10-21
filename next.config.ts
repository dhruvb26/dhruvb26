import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	// The homepage is a single scrolling page; these clean paths all serve
	// it so a shared /projects/foo URL lands scrolled to that project.
	// biome-ignore lint/suspicious/useAwait: Next.js requires rewrites to return a Promise
	async rewrites() {
		return [
			{ source: "/me", destination: "/" },
			{ source: "/projects", destination: "/" },
			{ source: "/projects/:slug", destination: "/" },
			{ source: "/wiki", destination: "/" },
			{ source: "/wiki/:category", destination: "/" },
		];
	},
	images: {
		remotePatterns: [{ hostname: "utfs.io" }, { hostname: "*.ufs.sh" }],
	},
};

export default nextConfig;
