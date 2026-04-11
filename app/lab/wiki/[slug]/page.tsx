import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getWikiArticle, getWikiSlugs, processWikiLinks } from "@/lib/wiki";

export async function generateStaticParams() {
	const slugs = await getWikiSlugs();
	return slugs.map((slug) => ({ slug }));
}

export default async function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const article = await getWikiArticle(slug);
	if (!article) notFound();

	const content = processWikiLinks(article.body);

	return (
		<article className="max-w-2xl px-8 sm:px-12 md:px-16 py-10 md:py-16">
			<h1 className="text-2xl font-medium mb-10">{article.title}</h1>
			<Markdown>{content}</Markdown>
		</article>
	);
}
