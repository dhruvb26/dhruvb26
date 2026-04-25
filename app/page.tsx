import fs from "node:fs/promises";
import path from "node:path";
import { ArrowDownToLineIcon, ArrowUpRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { HomeLabLink } from "@/components/home-lab-link";
import { Markdown } from "@/components/markdown";
import { PdfSplitView } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";

export default async function Home() {
	"use cache";
	cacheLife("max");

	const raw = await fs.readFile(path.join(process.cwd(), "content/home.md"), "utf-8");

	return (
		<PdfSplitView>
			<div className="@container flex h-dvh w-full bg-background">
				<div className="flex-1 flex flex-col min-w-0">
					<main className="flex flex-1 min-h-0 w-full max-w-3xl mx-auto flex-col items-start overflow-y-auto pt-24 pb-12 px-6 sm:px-10 md:px-16 bg-background">
						<div className="flex items-center justify-between w-full mb-4">
							<h1 className="text-2xl font-medium">Dhruv Bansal</h1>
							<span className="flex items-center gap-2">
								<a href="https://github.com/dhruvb26" target="_blank" rel="noopener noreferrer">
									<Button
										className="text-link text-lg px-0 transition-colors duration-300 ease-out hover:text-link/80"
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
										className="text-link text-lg px-0 transition-colors duration-300 ease-out hover:text-link/80"
										variant="link"
										hoverIcon={ArrowUpRightIcon}
									>
										LinkedIn
									</Button>
								</a>
								<a href="/api/resume" download>
									<Button
										className="text-link text-lg px-0 transition-colors duration-300 ease-out hover:text-link/80"
										variant="link"
										hoverIcon={ArrowDownToLineIcon}
									>
										Resume
									</Button>
								</a>
							</span>
						</div>
						<Markdown>{raw.replace(/^#\s+.+\n+/, "")}</Markdown>
					</main>
				</div>
				{/* <div className="hidden @5xl:flex w-1/2 shrink-0 items-center justify-center">
					<RLDiagram />
				</div> */}
				<HomeLabLink />
			</div>
		</PdfSplitView>
	);
}
