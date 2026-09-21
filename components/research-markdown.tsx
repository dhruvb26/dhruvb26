import { ArrowUpRightIcon } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { markdownHeadingClassNames } from "@/components/markdown";
import { cn } from "@/lib/utils";

const components: Components = {
	h1: ({ children, ...props }) => (
		<h2 className={markdownHeadingClassNames.h1} {...props}>
			{children}
		</h2>
	),
	h2: ({ children, ...props }) => (
		<h3 className={markdownHeadingClassNames.h2} {...props}>
			{children}
		</h3>
	),
	h3: ({ children, ...props }) => (
		<h4 className={markdownHeadingClassNames.h3} {...props}>
			{children}
		</h4>
	),
	h4: ({ children, ...props }) => (
		<h5 className={markdownHeadingClassNames.h4} {...props}>
			{children}
		</h5>
	),
	p: ({ children, ...props }) => (
		<p className="text-base leading-7 text-muted-foreground" {...props}>
			{children}
		</p>
	),
	a: ({ children, href, ...props }) => (
		<a
			href={href}
			className="text-link transition-colors hover:text-link/80"
			{...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			{...props}
		>
			{children}
			{href?.startsWith("http") && (
				<ArrowUpRightIcon className="ml-0.5 inline size-3 align-baseline" />
			)}
		</a>
	),
	ul: ({ children, ...props }) => (
		<ul
			className="ml-5 list-disc space-y-2 text-muted-foreground marker:text-foreground/40"
			{...props}
		>
			{children}
		</ul>
	),
	ol: ({ children, ...props }) => (
		<ol
			className="ml-5 list-decimal space-y-2 text-muted-foreground marker:text-foreground/40"
			{...props}
		>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => (
		<li className="pl-1 leading-7" {...props}>
			{children}
		</li>
	),
	blockquote: ({ children, ...props }) => (
		<blockquote className="border-l-2 border-link/40 pl-5 text-muted-foreground italic" {...props}>
			{children}
		</blockquote>
	),
	code: ({ children, className, ...props }) =>
		className ? (
			<code className={cn("font-mono text-sm", className)} {...props}>
				{children}
			</code>
		) : (
			<code
				className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
				{...props}
			>
				{children}
			</code>
		),
	pre: ({ children, ...props }) => (
		<pre
			className="overflow-x-auto rounded-md border border-border bg-muted/50 p-4 text-foreground"
			{...props}
		>
			{children}
		</pre>
	),
	table: ({ children, ...props }) => (
		<div className="overflow-x-auto rounded-md border border-border">
			<table className="w-full border-collapse text-sm" {...props}>
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead className="border-b border-border bg-muted/50 text-foreground" {...props}>
			{children}
		</thead>
	),
	tbody: ({ children, ...props }) => (
		<tbody className="divide-y divide-border text-muted-foreground" {...props}>
			{children}
		</tbody>
	),
	th: ({ children, ...props }) => (
		<th className="px-4 py-3 text-left font-medium" {...props}>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td className="px-4 py-3 align-top" {...props}>
			{children}
		</td>
	),
	img: ({ src, alt, ...props }) => (
		// biome-ignore lint/performance/noImgElement: research sources may use remote images
		<img
			src={src}
			alt={alt ?? ""}
			className="mx-auto my-2 max-h-[30rem] w-auto max-w-[85%] rounded-md border border-border object-contain"
			loading="lazy"
			{...props}
		/>
	),
	hr: (props) => <hr className="my-10 border-border" {...props} />,
	strong: ({ children, ...props }) => (
		<strong className="font-medium text-foreground" {...props}>
			{children}
		</strong>
	),
};

export function ResearchMarkdown({ children }: { children: string }) {
	return (
		<article className="research-document flex flex-col gap-4">
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex]}
				components={components}
			>
				{children}
			</ReactMarkdown>
		</article>
	);
}
