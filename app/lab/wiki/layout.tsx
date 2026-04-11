import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getWikiCategories } from "@/lib/wiki";
import { WikiShell } from "./wiki-shell";

async function WikiLayoutContent({ children }: { children: React.ReactNode }) {
	const categories = await getWikiCategories();
	return <WikiShell categories={categories}>{children}</WikiShell>;
}

export default function WikiLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-dvh bg-background">
					<Spinner className="text-muted-foreground/50" />
				</div>
			}
		>
			<WikiLayoutContent>{children}</WikiLayoutContent>
		</Suspense>
	);
}
