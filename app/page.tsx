import fs from "fs/promises";
import path from "path";
import { Markdown } from "@/components/markdown";

export default async function Home() {
	const md = await fs.readFile(path.join(process.cwd(), "content/home.md"), "utf-8");

	return (
		<div className="flex flex-col flex-1 bg-background">
			<main className="flex flex-1 w-full max-w-3xl flex-col items-start py-40 px-20 bg-background">
				<Markdown>{md}</Markdown>
			</main>
		</div>
	);
}