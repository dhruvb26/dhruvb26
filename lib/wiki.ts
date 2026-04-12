import fs from "node:fs/promises";
import { cacheLife, cacheTag } from "next/cache";
import path from "node:path";

const WIKI_DIR = path.join(process.cwd(), "content", "wiki");

export interface WikiEntry {
	slug: string;
	title: string;
	description: string;
}

export interface WikiCategory {
	name: string;
	entries: WikiEntry[];
}

interface Frontmatter {
	title?: string;
	tags?: string[];
}

function slugToTitle(slug: string): string {
	return slug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
	if (!raw.startsWith("---")) return { frontmatter: {}, body: raw };

	const end = raw.indexOf("---", 3);
	if (end === -1) return { frontmatter: {}, body: raw };

	const yaml = raw.slice(3, end).trim();
	const body = raw.slice(end + 3).replace(/^\n+/, "");

	const titleMatch = yaml.match(/^title:\s*(.+)/m);
	const frontmatter: Frontmatter = {
		title: titleMatch?.[1]?.trim(),
	};

	return { frontmatter, body };
}

async function readArticleTitle(slug: string): Promise<string> {
	try {
		const raw = await fs.readFile(path.join(WIKI_DIR, `${slug}.md`), "utf-8");
		const { frontmatter, body } = parseFrontmatter(raw);
		if (frontmatter.title) return frontmatter.title;
		const match = body.match(/^# (.+)/m);
		return match ? match[1] : slugToTitle(slug);
	} catch {
		return slugToTitle(slug);
	}
}

export async function getWikiCategories(): Promise<WikiCategory[]> {
	"use cache";
	cacheLife("max");
	cacheTag("wiki");

	const raw = await fs.readFile(path.join(WIKI_DIR, "INDEX.md"), "utf-8");
	const categories: WikiCategory[] = [];
	let current: WikiCategory | null = null;

	const lines = raw.split("\n");
	const entries: { category: WikiCategory; slug: string; description: string }[] = [];

	for (const line of lines) {
		const h2 = line.match(/^## (.+)/);
		if (h2) {
			current = { name: h2[1], entries: [] };
			categories.push(current);
			continue;
		}
		const entry = line.match(/^- \[\[(.+?)\]\] — (.+)/);
		if (entry && current) {
			entries.push({ category: current, slug: entry[1], description: entry[2] });
		}
	}

	const titles = await Promise.all(entries.map((e) => readArticleTitle(e.slug)));
	for (let i = 0; i < entries.length; i++) {
		entries[i].category.entries.push({
			slug: entries[i].slug,
			title: titles[i],
			description: entries[i].description,
		});
	}

	return categories;
}

export async function getWikiArticleExcerpt(slug: string): Promise<string> {
	"use cache";
	cacheLife("max");
	cacheTag("wiki");

	try {
		const raw = await fs.readFile(path.join(WIKI_DIR, `${slug}.md`), "utf-8");
		const { body } = parseFrontmatter(raw);
		const withoutTitle = body.replace(/^# .+\n+/, "");
		const firstParagraph = withoutTitle.split(/\n\n/)[0]?.trim() ?? "";
		return firstParagraph
			.replace(/\[\[([^|\]]+?)(?:\|([^\]]+))?\]\]/g, (_, slugPart: string, alias?: string) => {
				const slug = slugPart.trim();
				return alias?.trim() ?? slug;
			})
			.replace(/[*_]/g, "");
	} catch {
		return "";
	}
}

export async function getWikiArticle(
	slug: string,
): Promise<{ title: string; body: string } | null> {
	"use cache";
	cacheLife("max");
	cacheTag("wiki");

	const safeName = slug.replace(/[^a-z0-9-]/g, "");
	try {
		const raw = await fs.readFile(path.join(WIKI_DIR, `${safeName}.md`), "utf-8");
		const { frontmatter, body } = parseFrontmatter(raw);

		const titleMatch = body.match(/^# (.+)/m);
		const title = frontmatter.title ?? titleMatch?.[1] ?? slugToTitle(slug);
		const content = body.replace(/^# .+\n+/, "");

		return { title, body: content };
	} catch {
		return null;
	}
}

export async function getWikiSlugs(): Promise<string[]> {
	"use cache";
	cacheLife("max");
	cacheTag("wiki");

	const files = await fs.readdir(WIKI_DIR);
	return files
		.filter((f) => f.endsWith(".md") && f !== "INDEX.md")
		.map((f) => f.replace(/\.md$/, ""));
}

export function processWikiLinks(content: string): string {
	return content.replace(/\[\[([^|\]]+?)(?:\|([^\]]+))?\]\]/g, (_, slugPart: string, alias?: string) => {
		const slug = slugPart.trim();
		const label = alias?.trim() ?? slug;
		return `[${label}](/lab/wiki/${slug})`;
	});
}
