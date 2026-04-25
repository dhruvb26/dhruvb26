"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { LabControls } from "@/components/lab-controls";
import { Card } from "@/components/ui/card";

export default function LabPage() {
	return (
		<Show when="signed-in" fallback={null}>
			<div className="flex flex-col flex-1 bg-background">
				<main className="flex flex-1 w-full max-w-3xl mx-auto md:ml-[15%] md:mr-auto flex-col items-start py-40 px-6 sm:px-10 md:px-16 bg-background">
					<div className="w-full space-y-8">
						<div className="flex flex-col items-start gap-2">
							<h1 className="text-2xl font-medium">Lab</h1>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<Link href="/lab/board">
								<Card className="p-4 hover:bg-muted transition-colors text-base">Mood Board</Card>
							</Link>
							<Link href="/lab/wiki">
								<Card className="p-4 hover:bg-muted transition-colors text-base">Wiki</Card>
							</Link>
						</div>
					</div>
				</main>
				<LabControls />
			</div>
		</Show>
	);
}
