"use client";

import { Show, useClerk } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SFHouse } from "sf-symbols-lib/monochrome/icons/SFHouse";
import { SFRectanglePortraitAndArrowRight } from "sf-symbols-lib/monochrome/icons/SFRectanglePortraitAndArrowRight";
import { SFSquareGrid2x2 } from "sf-symbols-lib/monochrome/icons/SFSquareGrid2x2";
import { Button } from "@/components/ui/button";

export default function LabPage() {
	const { signOut } = useClerk();

	return (
		<Show when="signed-in" fallback={null}>
			<div className="flex flex-col flex-1 bg-background">
				<main className="flex flex-1 w-full max-w-3xl mx-auto md:ml-[15%] md:mr-auto flex-col items-start justify-between py-40 px-6 sm:px-10 md:px-16 bg-background">
					<div className="w-full space-y-8">
						<h1 className="text-2xl font-medium">Lab</h1>
						<div className="grid grid-cols-3 gap-2">
							<Link href="/lab/board">
								<Button size="lg" variant="link" hoverIcon={ChevronRight}>
									<SFSquareGrid2x2 size="sm" />
									Board
								</Button>
							</Link>
						</div>
					</div>
					<div className="flex flex-col items-start">
						<Link href="/">
							<Button size="lg" variant="link" hoverIcon={ChevronRight}>
								<SFHouse size="sm" />
								Home
							</Button>
						</Link>
						<Button size="lg" variant="link" hoverIcon={ChevronRight} onClick={() => signOut()}>
							<SFRectanglePortraitAndArrowRight size="sm" />
							Sign Out
						</Button>
					</div>
				</main>
			</div>
		</Show>
	);
}
