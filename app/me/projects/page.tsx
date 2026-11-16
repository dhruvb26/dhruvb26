import { ProjectArticle } from "@/components/project-article";
import { getResearchSlugs } from "@/lib/research";

export default function ProjectsPage() {
	return <ProjectArticle slug={getResearchSlugs()[0]} />;
}
