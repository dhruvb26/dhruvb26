import { cacheLife } from "next/cache";
import { PdfSplitView } from "@/components/pdf-viewer";
import { ResearchMarkdown } from "@/components/research-markdown";
import { getResearchDocument, getResearchMetadata, type ResearchSlug } from "@/lib/research";

export async function ProjectArticle({ slug }: { slug: ResearchSlug }) {
	"use cache";
	cacheLife("days");

	const metadata = getResearchMetadata(slug);
	const source = await getResearchDocument(slug);

	return (
		<PdfSplitView>
			<main className="mx-auto w-full max-w-4xl px-8 py-10 sm:px-12 md:px-16 md:py-16 lg:pt-[6.5rem]">
				<h1 className="text-2xl font-medium">{metadata.title}</h1>
				<p className="mt-2 mb-10 text-base leading-relaxed text-muted-foreground">
					{metadata.description}
				</p>
				<ResearchMarkdown>{source}</ResearchMarkdown>
			</main>
		</PdfSplitView>
	);
}
