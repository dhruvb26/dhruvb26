import { ArrowUpRightIcon, ChevronRight } from "lucide-react";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
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

const components: Components = {
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
		const { body, links } = splitTrailingLinks(children);
		if (links.length === 0) {
			return (
				<p className="text-base text-muted-foreground leading-relaxed" {...props}>
					{children}
				</p>
			);
		}
		return (
			<div className="text-base text-muted-foreground leading-relaxed">
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
	a: ({ children, ...props }) => <InlineLink {...props}>{children}</InlineLink>,
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
		<li className="text-base leading-relaxed" {...props}>
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
	hr: (props) => <hr className="border-border" {...props} />,
	strong: ({ children, ...props }) => (
		<strong className="font-medium text-foreground" {...props}>
			{children}
		</strong>
	),
};

export function Markdown({ children, className }: { children: string; className?: string }) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<ReactMarkdown components={components}>{children}</ReactMarkdown>
		</div>
	);
}
