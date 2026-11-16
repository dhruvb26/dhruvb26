import { Suspense } from "react";
import { KnowledgeShell } from "@/components/knowledge-shell";
import { Spinner } from "@/components/ui/spinner";
import { getResearchMetadata, getResearchSlugs } from "@/lib/research";
import { getWikiCategories } from "@/lib/wiki";

async function KnowledgeLayoutContent({ children }: { children: React.ReactNode }) {
	const categories = await getWikiCategories();
	const projects = getResearchSlugs().map((slug) => ({
		slug,
		title: getResearchMetadata(slug).title,
	}));
	return (
		<KnowledgeShell categories={categories} projects={projects}>
			{children}
		</KnowledgeShell>
	);
}

export function KnowledgeLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex h-dvh items-center justify-center bg-background">
					<Spinner className="text-muted-foreground/50" />
				</div>
			}
		>
			<KnowledgeLayoutContent>{children}</KnowledgeLayoutContent>
		</Suspense>
	);
}
