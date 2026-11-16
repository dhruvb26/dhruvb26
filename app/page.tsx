import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { KnowledgeLayout } from "@/components/knowledge-layout";
import { Markdown } from "@/components/markdown";

async function Bio() {
	"use cache";
	cacheLife("days");

	const raw = await fs.readFile(path.join(process.cwd(), "content/home.md"), "utf-8");

	return (
		<main className="w-full max-w-4xl px-8 py-10 sm:px-12 lg:px-16 lg:pt-[6.5rem] lg:pb-16">
			<h1 className="sr-only">Bio</h1>
			<Markdown className="font-medium [&_p]:text-base [&_p]:leading-relaxed sm:[&_p]:text-lg [&>div]:text-base sm:[&>div]:text-lg">
				{raw.replace(/^#\s+.+\n+/, "")}
			</Markdown>
		</main>
	);
}

export default function Home() {
	return (
		<KnowledgeLayout>
			<Bio />
		</KnowledgeLayout>
	);
}
