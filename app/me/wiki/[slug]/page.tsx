import { WikiArticle } from "@/components/wiki-article";
import { getWikiSlugs } from "@/lib/wiki";

export async function generateStaticParams() {
	const slugs = await getWikiSlugs();
	return (slugs.length > 0 ? slugs : ["__placeholder__"]).map((slug) => ({ slug }));
}

export default async function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	return <WikiArticle slug={slug} />;
}
