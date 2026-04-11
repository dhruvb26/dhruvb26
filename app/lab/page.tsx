"use client";

import { Show, useClerk } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LabPage() {
	const { signOut } = useClerk();
	const router = useRouter();
	return (
		<Show when="signed-in" fallback={null}>
			<div className="flex flex-col flex-1 bg-background">
				<ModeToggle />
				<main className="flex flex-1 w-full max-w-3xl mx-auto md:ml-[15%] md:mr-auto flex-col items-start justify-between py-40 px-6 sm:px-10 md:px-16 bg-background">
					<div className="w-full space-y-8">
						<div className="flex flex-col items-start gap-2">
							<h1 className="text-2xl font-medium">Lab</h1>
							<p className="text-muted-foreground">Stuff</p>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<Link href="/lab/board">
								<Card className="p-4 hover:bg-muted transition-colors text-base">Mood Board</Card>
							</Link>
						</div>
					</div>
					<div className="flex flex-col items-start gap-1">
						<Button
							size="lg"
							variant="link"
							hoverIcon={ChevronRight}
							onClick={() => router.push("/")}
						>
							Home
						</Button>
						<Button size="lg" variant="link" hoverIcon={ChevronRight} onClick={() => signOut()}>
							Logout
						</Button>
					</div>
				</main>
			</div>
		</Show>
	);
}
