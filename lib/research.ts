import { Cite } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import { cacheLife } from "next/cache";

const documents = {
	"feature-selection": {
		title: "Embedding-Based Markov Blanket Discovery",
		description:
			"A causal feature-selection pipeline combining TabPFN embeddings with a neural Markov blanket predictor.",
		sourceUrl:
			"https://raw.githubusercontent.com/dhruvb26/CSE472-blanket-challenge/main/solution/report/REPORT.md",
		bibliographyUrl:
			"https://raw.githubusercontent.com/dhruvb26/CSE472-blanket-challenge/main/solution/report/references.bib",
	},
	"multi-agent-code-generation": {
		title: "Advancing Multi-Agent Reinforcement Learning for Collaborative Coding Agents",
		description:
			"Two coding agents trained together with shared rewards and multi-agent group relative policy optimization.",
		sourceUrl: "https://raw.githubusercontent.com/dhruvb26/CSE475-Project/main/report/REPORT.md",
		bibliographyUrl:
			"https://raw.githubusercontent.com/dhruvb26/CSE475-Project/main/report/references.bib",
	},
	"negotiation-agents": {
		title: "Improving LLM Bargaining Ability via Self-Play Reinforcement Learning",
		description:
			"Training open-weight LLM negotiators with supervised fine-tuning, self-play reinforcement learning, and outcome-based rewards.",
		sourceUrl: "https://raw.githubusercontent.com/dhruvb26/CSE485-Capstone/main/report/report.md",
		bibliographyUrl:
			"https://raw.githubusercontent.com/dhruvb26/CSE485-Capstone/main/report/references.bib",
		excerpt: true,
		preprintUrl: "https://openreview.net/attachment?id=NQSQTaZlk4&name=pdf",
	},
} as const;

export type ResearchSlug = keyof typeof documents;

export function getResearchSlugs(): ResearchSlug[] {
	return Object.keys(documents) as ResearchSlug[];
}

export function getResearchMetadata(slug: ResearchSlug) {
	return documents[slug];
}

interface Citation {
	id: string;
	title?: string;
	author?: { given?: string; family?: string; literal?: string }[];
	issued?: { "date-parts"?: number[][] };
	"container-title"?: string;
	publisher?: string;
}

function authorName(author: NonNullable<Citation["author"]>[number]) {
	return author.literal ?? [author.given, author.family].filter(Boolean).join(" ");
}

function citationLabel(citation: Citation) {
	const family = citation.author?.[0]?.family ?? citation.author?.[0]?.literal ?? citation.id;
	const suffix = (citation.author?.length ?? 0) > 1 ? " et al." : "";
	const year = citation.issued?.["date-parts"]?.[0]?.[0];
	return `${family}${suffix}${year ? `, ${year}` : ""}`;
}

function renderBibliography(bibtex: string) {
	const citations = new Cite(bibtex).data as Citation[];
	const byId = new Map(citations.map((citation) => [citation.id, citation]));

	const references = citations
		.map((citation, index) => {
			const authors = citation.author?.map(authorName).join(", ");
			const year = citation.issued?.["date-parts"]?.[0]?.[0];
			const publication = citation["container-title"] ?? citation.publisher;
			return `${index + 1}. ${[
				authors,
				citation.title ? `**${citation.title}**` : undefined,
				publication ? `*${publication}*` : undefined,
				year ? String(year) : undefined,
			]
				.filter(Boolean)
				.join(". ")}.`;
		})
		.join("\n");

	return {
		references,
		replaceCitations(source: string) {
			return source.replace(/\[@([^\]]+)\]/g, (_, group: string) => {
				const labels = group
					.split(";")
					.map((key) => key.trim().replace(/^@/, ""))
					.map((key) => byId.get(key))
					.filter((citation): citation is Citation => Boolean(citation))
					.map(citationLabel);
				return labels.length > 0 ? `(${labels.join("; ")})` : `[@${group}]`;
			});
		},
	};
}

function cleanLatexText(value: string) {
	return value
		.replace(/\\textbf\{([^{}]*)\}/g, "**$1**")
		.replace(/\\texttt\{([^{}]*)\}/g, "`$1`")
		.replace(/\\emph\{([^{}]*)\}/g, "*$1*")
		.replace(/\\([_%])/g, "$1")
		.replace(/~?\\(?:ref|label)\{[^}]+\}/g, "")
		.trim();
}

function renderLatexTables(source: string) {
	return source.replace(/\\begin\{table\}(?:\[[^\]]*])?([\s\S]*?)\\end\{table\}/g, (_, table) => {
		const tabular = table.match(/\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/)?.[1];
		if (!tabular) return "";

		const rows = tabular
			.split("\n")
			.map((line: string) => line.trim())
			.filter(
				(line: string) =>
					line.includes("&") &&
					!line.startsWith("\\toprule") &&
					!line.startsWith("\\midrule") &&
					!line.startsWith("\\bottomrule"),
			)
			.map((line: string) =>
				line
					.replace(/\\\\\s*$/, "")
					.split("&")
					.map(cleanLatexText),
			);
		if (rows.length === 0) return "";

		const width = Math.max(...rows.map((row: string[]) => row.length));
		const markdownRows = rows.map(
			(row: string[]) => `| ${[...row, ...Array(width - row.length).fill("")].join(" | ")} |`,
		);
		markdownRows.splice(1, 0, `| ${Array(width).fill("---").join(" | ")} |`);

		const caption = table.match(/\\caption\{((?:[^{}]|\{[^{}]*\})*)\}/)?.[1];
		return `${markdownRows.join("\n")}${caption ? `\n\n*${cleanLatexText(caption)}*` : ""}`;
	});
}

function expandNestedBinomials(source: string) {
	return source.replace(
		/(\\d?frac)\{(\\binom\{[^{}]*\}\{[^{}]*\})\}\{(\\binom\{[^{}]*\}\{[^{}]*\})\}/g,
		"$1{\\displaystyle $2}{\\displaystyle $3}",
	);
}

function extractAbstractAndIntroduction(source: string) {
	const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
	const abstract = frontmatter
		.match(/^abstract:\s*\|\s*\n((?:[ \t]+.*(?:\n|$))*)/m)?.[1]
		?.replace(/^[ \t]{2}/gm, "")
		.trim();
	const introductionHeading = source.match(/^# Introduction\s*$/m);
	const afterHeading = introductionHeading
		? source.slice((introductionHeading.index ?? 0) + introductionHeading[0].length)
		: "";
	const nextHeading = afterHeading.search(/^#\s/m);
	const introduction = (
		nextHeading === -1 ? afterHeading : afterHeading.slice(0, nextHeading)
	).trim();

	return [
		abstract ? `# Abstract\n\n${abstract}` : null,
		introduction ? `# Introduction\n\n${introduction}` : null,
	]
		.filter(Boolean)
		.join("\n\n");
}

function normalizePandocLatex(source: string, sourceUrl: string) {
	const sourceDirectory = new URL(".", sourceUrl);

	return expandNestedBinomials(renderLatexTables(source))
		.replace(
			/\\begin\{align\}([\s\S]*?)\\end\{align\}/g,
			(_, math: string) => `$$\n\\begin{aligned}${math}\\end{aligned}\n$$`,
		)
		.replace(/\\includegraphics(?:\[[^\]]*])?\{([^}]+)\}/g, (_, path: string) => {
			const assetUrl = new URL(path, sourceDirectory);
			assetUrl.hostname = "media.githubusercontent.com";
			assetUrl.pathname = `/media${assetUrl.pathname}`;
			return `![Research figure](${assetUrl.href})`;
		})
		.replace(
			/\\caption\{((?:[^{}]|\{[^{}]*\})*)\}/g,
			(_, caption: string) => `*${cleanLatexText(caption)}*`,
		)
		.replace(
			/\\(?:begin|end)\{(?:figure|minipage|center|tabular)\}(?:\{[^}]*\})?(?:\[[^\]]*])?/g,
			"",
		)
		.replace(/\\(?:centering|hfill|small|footnotesize|toprule|midrule|bottomrule)\b/g, "")
		.replace(/\\(?:vspace|resizebox)\{[^}]*\}(?:\{[^}]*\})?/g, "")
		.replace(/\\texttt\{([^{}]*)\}/g, "`$1`")
		.replace(/~?\\(?:ref|label)\{[^}]+\}/g, "")
		.replace(/\\([_%])/g, "$1");
}

function normalizeSource(source: string, sourceUrl: string, bibliography: string) {
	let normalized = source.replace(/^---\n[\s\S]*?\n---\n+/, "");

	const abstractIndex = normalized.indexOf("# Abstract");
	if (abstractIndex !== -1) normalized = normalized.slice(abstractIndex);
	normalized = normalizePandocLatex(normalized, sourceUrl);

	const rendered = renderBibliography(bibliography);
	normalized = rendered.replaceCitations(normalized);
	normalized = normalized.replace(/^# References\s*$/m, `# References\n\n${rendered.references}`);

	return normalized;
}

export async function getResearchDocument(slug: ResearchSlug) {
	"use cache";
	cacheLife("days");

	const metadata = documents[slug];
	const [sourceResponse, bibliographyResponse] = await Promise.all([
		fetch(metadata.sourceUrl),
		fetch(metadata.bibliographyUrl),
	]);
	if (!sourceResponse.ok) {
		throw new Error(`Failed to fetch research source: ${sourceResponse.status}`);
	}
	if (!bibliographyResponse.ok) {
		throw new Error(`Failed to fetch research bibliography: ${bibliographyResponse.status}`);
	}

	const source = await sourceResponse.text();
	return normalizeSource(
		"excerpt" in metadata ? extractAbstractAndIntroduction(source) : source,
		metadata.sourceUrl,
		await bibliographyResponse.text(),
	);
}
