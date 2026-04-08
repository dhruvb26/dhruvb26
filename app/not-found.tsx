import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex flex-col flex-1 bg-background">
			<main className="flex flex-1 w-full max-w-3xl mx-auto md:ml-[15%] md:mr-auto flex-col items-start justify-center py-40 px-6 sm:px-10 md:px-16 bg-background">
				<h1 className="text-2xl font-medium">404</h1>
				<p className="text-muted-foreground mt-2">this page doesn&apos;t exist.</p>
				<Link href="/" className="mt-6">
					<Button variant="link" size="lg" hoverIcon={ChevronRight} className="px-0">
						go home
					</Button>
				</Link>
			</main>
		</div>
	);
}
