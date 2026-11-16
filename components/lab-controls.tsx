"use client";

import { Show, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

// biome-ignore lint/suspicious/noEmptyBlockStatements: noop for client-only gate
const emptySubscribe = () => () => {};

export function LabControls({ showHome = true }: { showHome?: boolean }) {
	const { signOut } = useClerk();
	const router = useRouter();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	if (!mounted) return null;

	return (
		<div className="fixed bottom-8 right-6 z-50 flex items-center gap-4 lg:bottom-12">
			{showHome && (
				<button
					type="button"
					onClick={() => router.push("/")}
					className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200"
				>
					Home
				</button>
			)}
			<Show when="signed-in" fallback={null}>
				<button
					type="button"
					onClick={() => signOut()}
					className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200"
				>
					Sign Out
				</button>
			</Show>
		</div>
	);
}
