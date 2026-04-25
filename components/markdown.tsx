import { ArrowUpRightIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isLink(child: React.ReactNode): boolean {
	return (
		React.isValidElement(child) &&
		(child as React.ReactElement<{ node?: { tagName?: string } }>).props?.node?.tagName === "a"
	);
}

function isWhitespace(child: React.ReactNode): boolean {
	return typeof child === "string" && child.trim() === "";
}

function splitTrailingLinks(children: React.ReactNode) {
	const arr = React.Children.toArray(children);

	let splitIdx = arr.length;
	for (let i = arr.length - 1; i >= 0; i--) {
		if (isLink(arr[i]) || isWhitespace(arr[i])) {
			splitIdx = i;
		} else {
			break;
		}
	}

	const trailingLinks = arr.slice(splitIdx).filter(isLink);
	if (trailingLinks.length === 0) return { body: children, links: [] };

	return { body: arr.slice(0, splitIdx), links: trailingLinks };
}

function isExternal(href?: string) {
	return href?.startsWith("http") || href?.startsWith("//");
}

function InlineLink({ children, href, ...props }: React.ComponentProps<"a">) {
	const external = isExternal(href);
	return (
		<a
			className="text-link transition-colors duration-300 ease-out hover:text-link/80"
			href={href}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			{...props}
		>
			{children}
		</a>
	);
}

function isReportLink(children?: React.ReactNode): boolean {
	const text = React.Children.toArray(children)
		.map((c) => (typeof c === "string" ? c : ""))
		.join("")
		.trim();
	return text === "Report";
}

function TagLink({ children, href }: { children?: React.ReactNode; href?: string }) {
	const report = isReportLink(children);
	const external = !report && isExternal(href);
	return (
		<a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
			<Button
				className="text-link px-0 transition-colors duration-300 ease-out hover:text-link/80"
				variant="link"
				size="lg"
				hoverIcon={external ? ArrowUpRightIcon : ChevronRight}
			>
				{children}
			</Button>
		</a>
	);
}

function getComponents(variant: "default" | "wiki"): Components {
return {
	h1: ({ children, ...props }) => (
		<h1 className="text-2xl font-medium" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }) => (
		<h2 className="text-xl font-medium" {...props}>
			{children}
		</h2>
	),
	h3: ({ children, ...props }) => (
		<h3 className="text-lg font-medium" {...props}>
			{children}
		</h3>
	),
	p: ({ children, ...props }) => {
		if (variant === "wiki") {
			return (
		<p className="text-lg text-muted-foreground leading-relaxed" {...props}>
				{children}
			</p>
		);
	}
	const { body, links } = splitTrailingLinks(children);
	if (links.length === 0) {
		return (
			<p className="text-lg text-muted-foreground leading-relaxed" {...props}>
				{children}
			</p>
		);
	}
	return (
		<div className="text-lg text-muted-foreground leading-relaxed">
				<p>{body}</p>
				<span className="inline-flex flex-wrap gap-1.5 mt-2">
					{links.map((link) => {
						if (!React.isValidElement(link)) return null;
						const props = link.props as { href?: string; children?: React.ReactNode };
						return (
							<TagLink key={props.href} href={props.href}>
								{props.children}
							</TagLink>
						);
					})}
				</span>
			</div>
		);
	},
	a: ({ children, href, ...props }) => {
		if (variant === "wiki" && href && !isExternal(href)) {
			return (
				<Link
					href={href}
					className="text-link transition-colors duration-300 ease-out hover:text-link/80"
				>
					{children}
				</Link>
			);
		}
		return <InlineLink href={href} {...props}>{children}</InlineLink>;
	},
	ul: ({ children, ...props }) => (
		<ul className="list-disc pl-6 text-muted-foreground space-y-1" {...props}>
			{children}
		</ul>
	),
	ol: ({ children, ...props }) => (
		<ol className="list-decimal pl-6 text-muted-foreground space-y-1" {...props}>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => (
		<li className="text-lg leading-relaxed" {...props}>
			{children}
		</li>
	),
	blockquote: ({ children, ...props }) => (
		<blockquote className="border-l-2 border-border pl-4 text-muted-foreground italic" {...props}>
			{children}
		</blockquote>
	),
	code: ({ children, className: codeClassName, ...props }) => {
		const isInline = !codeClassName;
		return isInline ? (
			<code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
				{children}
			</code>
		) : (
			<code
				className={cn(
					"block rounded-md bg-muted p-4 text-sm font-mono overflow-x-auto",
					codeClassName,
				)}
				{...props}
			>
				{children}
			</code>
		);
	},
	pre: ({ children, ...props }) => (
		<pre className="rounded-md bg-muted p-4 overflow-x-auto" {...props}>
			{children}
		</pre>
	),
	img: ({ src, alt, ...props }) => (
		// biome-ignore lint/performance/noImgElement: external URLs from markdown, can't use next/image
		<img
			src={src}
			alt={alt ?? ""}
			className="rounded-md max-w-full h-auto my-1"
			loading="lazy"
			{...props}
		/>
	),
	table: ({ children, ...props }) => (
		<div className="overflow-x-auto my-1">
			<table className="w-full border-collapse text-sm" {...props}>
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead className="border-b border-border" {...props}>
			{children}
		</thead>
	),
	tbody: ({ children, ...props }) => (
		<tbody className="divide-y divide-border" {...props}>
			{children}
		</tbody>
	),
	tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
	th: ({ children, ...props }) => (
		<th className="px-3 py-2 text-left font-medium text-foreground" {...props}>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td className="px-3 py-2 text-muted-foreground" {...props}>
			{children}
		</td>
	),
	del: ({ children, ...props }) => (
		<del className="text-muted-foreground/60 line-through" {...props}>
			{children}
		</del>
	),
	input: ({ type, checked, ...props }) =>
		type === "checkbox" ? (
			<input
				type="checkbox"
				checked={checked}
				readOnly
				className="mr-1.5 align-middle accent-link"
				{...props}
			/>
		) : (
			<input type={type} {...props} />
		),
	hr: (props) => <hr className="border-border" {...props} />,
	strong: ({ children, ...props }) => (
		<strong className="font-medium text-foreground" {...props}>
			{children}
		</strong>
	),
};
}

export function Markdown({ children, className, variant = "default" }: { children: string; className?: string; variant?: "default" | "wiki" }) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={getComponents(variant)}>
				{children}
			</ReactMarkdown>
		</div>
	);
}
