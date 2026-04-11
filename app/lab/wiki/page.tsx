import Link from "next/link";
import { getWikiArticleExcerpt, getWikiCategories } from "@/lib/wiki";

async function ArticleCard({ slug, title }: { slug: string; title: string }) {
	const excerpt = await getWikiArticleExcerpt(slug);

	return (
		<Link href={`/lab/wiki/${slug}`} className="group block">
			<h3 className="text-base font-medium text-link group-hover:text-link/70 transition-colors duration-150">
				{title}
			</h3>
			{excerpt && (
				<p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{excerpt}</p>
			)}
		</Link>
	);
}

export default async function WikiIndexPage() {
	const categories = await getWikiCategories();
	const totalEntries = categories.reduce((sum, cat) => sum + cat.entries.length, 0);

	const featured = categories[0]?.entries[0];

	return (
		<div className="max-w-3xl px-8 sm:px-12 md:px-16 py-10 md:py-16">
			<div className="mb-12">
				<h1 className="text-2xl font-medium mb-1">Wiki</h1>
				<p className="text-sm text-muted-foreground">
					{totalEntries} entries across {categories.length} topics
				</p>
			</div>

			<div className="space-y-12">
				{featured && (
					<section>
						<h2 className="text-xs font-medium text-muted-foreground/50 mb-5">Featured</h2>
						<ArticleCard slug={featured.slug} title={featured.title} />
					</section>
				)}
				{categories.map((cat) => (
					<section key={cat.name}>
						<h2 className="text-xs font-medium text-muted-foreground/50 mb-5">{cat.name}</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
							{cat.entries.map((entry) => (
								<ArticleCard key={entry.slug} slug={entry.slug} title={entry.title} />
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
