"use client";

import { Show, useClerk } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabPage() {
	const { signOut } = useClerk();

	return (
		<div className="flex flex-col flex-1 bg-background">
			<main className="flex flex-1 w-full max-w-3xl mx-auto md:ml-[15%] md:mr-auto flex-col items-start justify-between py-40 px-6 sm:px-10 md:px-16 bg-background">
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
