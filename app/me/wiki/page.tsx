import { WikiArticle } from "@/components/wiki-article";
import { getWikiCategories } from "@/lib/wiki";

export default async function WikiPage() {
	const categories = await getWikiCategories();
	const firstArticle = categories.flatMap((category) => category.entries)[0];

	if (firstArticle) {
		return <WikiArticle slug={firstArticle.slug} />;
	}

	return (
		<main className="mx-auto w-full max-w-4xl px-8 py-16 lg:pt-[6.5rem]">
			<h1 className="text-2xl font-medium">Wiki</h1>
			<p className="mt-4 text-muted-foreground">No wiki articles are available yet.</p>
		</main>
	);
}
