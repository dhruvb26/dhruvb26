import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/project-article";
import { getResearchSlugs, type ResearchSlug } from "@/lib/research";

export function generateStaticParams() {
	return getResearchSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	if (!getResearchSlugs().some((project) => project === slug)) notFound();
	return <ProjectArticle slug={slug as ResearchSlug} />;
}
