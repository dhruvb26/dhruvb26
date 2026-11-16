import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getWikiArticle, getWikiSlugs, processWikiLinks } from "@/lib/wiki";

export async function WikiArticle({ slug }: { slug: string }) {
	const [article, slugs] = await Promise.all([getWikiArticle(slug), getWikiSlugs()]);
	if (!article) notFound();

	return (
		<main className="mx-auto w-full max-w-4xl px-8 py-10 sm:px-12 md:px-16 md:py-16 lg:pt-[6.5rem]">
			<h1 className="mb-10 text-2xl font-medium">{article.title}</h1>
			<Markdown variant="wiki">{processWikiLinks(article.body, new Set(slugs))}</Markdown>
		</main>
	);
}
