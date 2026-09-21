import fs from "node:fs/promises";
import path from "node:path";
import { ArrowDownToLineIcon, ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { HomeLabLink } from "@/components/home-lab-link";
import { HomeSectionNav } from "@/components/home-section-nav";
import { Markdown } from "@/components/markdown";
import { PdfSplitView } from "@/components/pdf-viewer";
import { ResearchMarkdown } from "@/components/research-markdown";
import { Button } from "@/components/ui/button";
import { getResearchDocument, getResearchMetadata, getResearchSlugs } from "@/lib/research";
import { getWikiCategories } from "@/lib/wiki";

export default async function Home() {
	"use cache";
	cacheLife("days");

	const raw = await fs.readFile(path.join(process.cwd(), "content/home.md"), "utf-8");
	const researchSlugs = getResearchSlugs();
	const [wikiCategories, researchEntries] = await Promise.all([
		getWikiCategories(),
		Promise.all(
			researchSlugs.map(async (slug) => ({
				slug,
				metadata: getResearchMetadata(slug),
				source: await getResearchDocument(slug),
			})),
		),
	]);
	return (
		<PdfSplitView>
			<div className="min-h-dvh w-full bg-background">
				<HomeSectionNav />
				<main className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-16 sm:px-10 md:px-16">
					<section id="me" className="min-h-dvh scroll-mt-16 py-16 md:py-20">
						<div className="mb-4 flex w-full items-center justify-between">
							<h1 className="text-2xl font-medium">Dhruv Bansal</h1>
							<span className="flex items-center gap-2">
								<a href="https://github.com/dhruvb26" target="_blank" rel="noopener noreferrer">
									<Button
										className="text-link text-base px-0 transition-colors duration-300 ease-out hover:text-link/80"
										variant="link"
										hoverIcon={ArrowUpRightIcon}
									>
										GitHub
									</Button>
								</a>
								<a
									href="https://www.linkedin.com/in/dhruvb26/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										className="text-link text-base px-0 transition-colors duration-300 ease-out hover:text-link/80"
										variant="link"
										hoverIcon={ArrowUpRightIcon}
									>
										LinkedIn
									</Button>
								</a>
								<a href="/api/resume" download>
									<Button
										className="text-link text-base px-0 transition-colors duration-300 ease-out hover:text-link/80"
										variant="link"
										hoverIcon={ArrowDownToLineIcon}
									>
										Resume
									</Button>
								</a>
							</span>
						</div>
						<Markdown>{raw.replace(/^#\s+.+\n+/, "")}</Markdown>
					</section>

					<section
						id="projects"
						className="min-h-dvh scroll-mt-16 border-t border-border py-12 md:py-16"
					>
						<p className="mb-2 text-sm text-muted-foreground">Selected work</p>
						<h2 className="mb-6 text-2xl font-medium">Projects</h2>
						<div className="divide-y divide-border border-y border-border">
							{researchEntries.map(({ slug, metadata, source }) => (
								<details key={slug} id={`project-${slug}`} className="group scroll-mt-20">
									<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-base text-foreground transition-colors hover:text-link [&::-webkit-details-marker]:hidden">
										<span>
											<span className="block">{metadata.title}</span>
											<span className="mt-1 block max-w-xl text-sm font-normal leading-5 text-muted-foreground">
												{metadata.description}
											</span>
										</span>
										<ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
									</summary>
									<div className="border-t border-border pt-6 pb-10">
										<ResearchMarkdown>{source}</ResearchMarkdown>
										{"preprintUrl" in metadata && (
											<a
												href={metadata.preprintUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="mt-8 inline-flex items-center gap-1 text-sm text-link transition-colors hover:text-link/80"
											>
												Read the anonymous preprint
												<ArrowUpRightIcon className="size-3.5" />
											</a>
										)}
									</div>
								</details>
							))}
						</div>
					</section>

					<section
						id="wiki"
						className="min-h-dvh scroll-mt-16 border-t border-border py-12 md:py-16"
					>
						<p className="mb-2 text-sm text-muted-foreground">
							A running collection of things I find interesting
						</p>
						<div className="mb-6">
							<h2 className="text-2xl font-medium">Wiki</h2>
						</div>
						<div className="space-y-7">
							{wikiCategories.map((category) => (
								<div key={category.name}>
									<h3 className="mb-3 text-sm text-muted-foreground">{category.name}</h3>
									<div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
										{category.entries.map((entry) => (
											<a
												key={entry.slug}
												href={`/lab/wiki/${entry.slug}`}
												className="text-base leading-6 text-foreground transition-colors hover:text-link"
											>
												{entry.title}
											</a>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				</main>
				<HomeLabLink />
			</div>
		</PdfSplitView>
	);
}
