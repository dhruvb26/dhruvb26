import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Toaster } from "@/components/ui/sonner";

const diatypeRounded = localFont({
	src: "../public/fonts/diatype-rounded.woff2",
	variable: "--font-diatype-rounded",
	weight: "100 900",
	display: "swap",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const uploadthingRouterConfig = extractRouterConfig(ourFileRouter);

export const metadata: Metadata = {
	title: "Dhruv Bansal",
	description: "my personal website",
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
			className={`h-full antialiased font-sans ${diatypeRounded.variable} ${geistMono.variable}`}
		>
			<body className="min-h-full flex flex-col">
				<ClerkProvider>
					<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
						<NextSSRPlugin routerConfig={uploadthingRouterConfig} />
						{children}
						<ModeToggle />
						<Toaster />
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
