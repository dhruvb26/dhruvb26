"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// biome-ignore lint/suspicious/noEmptyBlockStatements: noop for client-only gate
const emptySubscribe = () => () => {};

export function LabControls() {
	const { signOut } = useClerk();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	if (!mounted) return null;

	return (
		<div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
			<button
				type="button"
				onClick={() => router.push("/")}
				className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200"
			>
				Home
			</button>
			<button
				type="button"
				onClick={() => signOut()}
				className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200"
			>
				Sign Out
			</button>
			<button
				type="button"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200"
			>
				{theme === "dark" ? "Light" : "Dark"}
			</button>
		</div>
	);
}
