"use client";

import { Show, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function LabPage() {
	const { signOut } = useClerk();

	return (
		<div className="flex flex-col flex-1 bg-background">
			<main className="flex flex-1 w-full max-w-3xl flex-col items-start justify-between py-40 px-20 bg-background">
				<h1 className="text-2xl font-medium">Lab</h1>
				<Show when="signed-in">
					<Button size="lg" variant="link" hoverIcon={ChevronRight} onClick={() => signOut()}>
						Sign Out
					</Button>
				</Show>
			</main>
		</div>
	);
}