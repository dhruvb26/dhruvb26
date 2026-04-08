"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// biome-ignore lint/suspicious/noEmptyBlockStatements: noop unsubscribe for client-only gate
const emptySubscribe = () => () => {};

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	if (!mounted) return null;

	return (
		<button
			type="button"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="fixed bottom-6 right-6 z-50 text-base text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 "
		>
			{theme === "dark" ? "light" : "dark"}
		</button>
	);
}
