"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";

export function HomeLabLink() {
	return (
		<Show when="signed-in" fallback={null}>
			<Link
				href="/lab"
				className="fixed bottom-6 right-6 z-50 text-base text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200"
			>
				Lab
			</Link>
		</Show>
	);
}
