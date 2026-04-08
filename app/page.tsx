import fs from "node:fs/promises";
import path from "node:path";
import { ArrowDownToLineIcon, ArrowUpRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { Markdown } from "@/components/markdown";
import { PdfSplitView } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";

export default async function Home() {
	"use cache";
	cacheLife("max");

	const raw = await fs.readFile(path.join(process.cwd(), "content/home.md"), "utf-8");
	const md = raw.replace(/^#\s+.*\n+/, "");

	return (
		<PdfSplitView>
			<div className="flex flex-col flex-1 bg-background">
				<main className="flex flex-1 w-full max-w-3xl mx-auto flex-col items-start py-40 px-6 sm:px-10 md:px-16 bg-background">
					<div className="flex items-center justify-between w-full mb-4">
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
					<Markdown>{md}</Markdown>
				</main>
			</div>
		</PdfSplitView>
	);
}
