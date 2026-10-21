import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const diatypeRounded = localFont({
	src: "../public/fonts/diatype-rounded.woff2",
	variable: "--font-diatype-rounded",
	weight: "100 900",
	display: "swap",
});

const departureMono = localFont({
	src: "../public/fonts/departure-mono.woff2",
	variable: "--font-departure-mono",
	weight: "400",
	display: "swap",
});

const uploadthingRouterConfig = extractRouterConfig(ourFileRouter);

export const metadata: Metadata = {
	metadataBase: new URL("https://www.dhruv-b.dev"),
	title: "Dhruv Bansal",
	description: "my personal website",
	// The share thumbnail itself comes from app/opengraph-image.tsx.
	openGraph: {
		title: "Dhruv Bansal",
		description: "my personal website",
		url: "https://www.dhruv-b.dev",
		siteName: "Dhruv Bansal",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Dhruv Bansal",
		description: "my personal website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`h-full antialiased font-sans ${diatypeRounded.variable} ${departureMono.variable}`}
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
					<NextSSRPlugin routerConfig={uploadthingRouterConfig} />
					<Suspense>
						<ClerkProvider>{children}</ClerkProvider>
					</Suspense>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
