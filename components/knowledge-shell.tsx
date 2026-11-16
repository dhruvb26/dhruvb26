"use client";

import { Show } from "@clerk/nextjs";
import { ArrowUpRightIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LabControls } from "@/components/lab-controls";
import { hoverArrowClass } from "@/lib/hover-arrow";
import type { WikiCategory } from "@/lib/wiki";

interface ProjectLink {
	slug: string;
	title: string;
}

const sectionLinkClass =
	"flex min-h-11 w-full items-center rounded-md text-xl font-medium tracking-tight transition-colors";
const socialLinkClass =
	"group/link inline-flex items-center text-xl text-foreground transition-colors duration-300 ease-out hover:text-foreground/70";

function activeSlug(pathname: string, section: string, firstSlug?: string) {
	if (pathname === section) return firstSlug;
	return pathname.startsWith(`${section}/`)
		? pathname.slice(section.length + 1).replace(/\/$/, "")
		: null;
}

function startTitleScroll(event: React.SyntheticEvent<HTMLAnchorElement>) {
	const link = event.currentTarget;
	const viewport = link.querySelector<HTMLElement>(".sidebar-title-viewport");
	const full = link.querySelector<HTMLElement>(".sidebar-title-full");
	if (!viewport) return;
	if (!full) return;
	const distance = Math.ceil(full.getBoundingClientRect().width - viewport.clientWidth);
	if (distance <= 1) {
		delete link.dataset.overflowing;
		return;
	}

	link.style.setProperty("--title-pan-distance", `${distance}px`);
	link.style.setProperty("--title-pan-duration", `${Math.max(2, distance / 65 + 0.8)}s`);
	link.dataset.overflowing = "true";
}

function stopTitleScroll(event: React.SyntheticEvent<HTMLAnchorElement>) {
	delete event.currentTarget.dataset.overflowing;
}

export function KnowledgeShell({
	categories,
	projects,
	children,
}: {
	categories: WikiCategory[];
	projects: ProjectLink[];
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const section = pathname.startsWith("/me/projects")
		? "projects"
		: pathname.startsWith("/me/wiki")
			? "wiki"
			: "me";
	const activeProject = activeSlug(pathname, "/me/projects", projects[0]?.slug);
	const activeWiki = activeSlug(pathname, "/me/wiki", categories[0]?.entries[0]?.slug);

	return (
		<div className="flex min-h-dvh w-full flex-col bg-background lg:grid lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
			<div className="min-w-0 lg:col-start-2 lg:row-start-1">{children}</div>
			<aside className="flex flex-col gap-2 px-6 py-8 sm:px-10 lg:sticky lg:top-0 lg:col-start-1 lg:row-start-1 lg:h-dvh lg:overflow-hidden lg:px-12 lg:py-12">
				<div className="flex shrink-0 flex-col gap-6">
					<Link
						href="/"
						aria-label="Home"
						className="flex size-8 shrink-0 items-center justify-center"
					>
						<Image src="/favicon.ico" alt="" width={32} height={32} unoptimized />
					</Link>
					<nav aria-label="Main sections" className="flex flex-col items-stretch gap-2">
						<Link
							href="/"
							aria-current={section === "me" ? "page" : undefined}
							className={`${sectionLinkClass} ${section === "me" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
						>
							Me
						</Link>
						<Link
							href="/me/projects"
							aria-current={section === "projects" ? "page" : undefined}
							className={`${sectionLinkClass} ${section === "projects" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
						>
							Projects
						</Link>
						{section === "projects" ? (
							<div className="ml-4 flex flex-col self-stretch">
								{projects.map((project) => (
									<Link
										key={project.slug}
										href={`/me/projects/${project.slug}`}
										aria-current={activeProject === project.slug ? "page" : undefined}
										onPointerEnter={startTitleScroll}
										onPointerLeave={stopTitleScroll}
										onFocus={startTitleScroll}
										onBlur={stopTitleScroll}
										className={`sidebar-title-link flex min-h-9 w-full min-w-0 items-center rounded-md px-3 py-2 text-base leading-snug transition-colors ${
											activeProject === project.slug
												? "bg-muted font-medium text-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground"
										}`}
									>
										<span className="sidebar-title-viewport relative block min-w-0 flex-1 overflow-hidden">
											<span className="sidebar-title-preview block truncate">{project.title}</span>
											<span aria-hidden="true" className="sidebar-title-full">
												{project.title}
											</span>
										</span>
									</Link>
								))}
							</div>
						) : null}
						<Link
							href="/me/wiki"
							aria-current={section === "wiki" ? "page" : undefined}
							className={`${sectionLinkClass} ${section === "wiki" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
						>
							Wiki
						</Link>
					</nav>
				</div>
				{section === "wiki" ? (
					<nav aria-label="Wiki topics" className="min-h-0 lg:flex-1 lg:overflow-y-auto">
						<div className="ml-4 flex flex-col gap-3">
							{categories.map((category) => {
								const isActive = category.entries.some((entry) => entry.slug === activeWiki);
								return (
									<details key={category.name} open={isActive} className="group/wiki-topic">
										<summary
											className={`flex min-h-9 cursor-pointer list-none items-center gap-1 rounded-md px-2 py-2 text-base leading-snug font-medium transition-colors [&::-webkit-details-marker]:hidden ${
												isActive
													? "bg-muted text-foreground"
													: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
											}`}
										>
											<ChevronRight
												aria-hidden="true"
												className="size-3.5 shrink-0 transition-transform group-open/wiki-topic:rotate-90"
											/>
											{category.name}
										</summary>
										<div className="ml-4 flex flex-col pt-2">
											{category.entries.map((entry) => (
												<Link
													key={entry.slug}
													href={`/me/wiki/${entry.slug}`}
													aria-current={activeWiki === entry.slug ? "page" : undefined}
													onPointerEnter={startTitleScroll}
													onPointerLeave={stopTitleScroll}
													onFocus={startTitleScroll}
													onBlur={stopTitleScroll}
													className={`sidebar-title-link flex min-h-9 w-full min-w-0 items-center rounded-md px-3 py-2 text-base leading-snug transition-colors ${
														activeWiki === entry.slug
															? "bg-muted font-medium text-foreground"
															: "text-muted-foreground hover:bg-muted hover:text-foreground"
													}`}
												>
													<span className="sidebar-title-viewport relative block min-w-0 flex-1 overflow-hidden">
														<span className="sidebar-title-preview block truncate">
															{entry.title}
														</span>
														<span aria-hidden="true" className="sidebar-title-full">
															{entry.title}
														</span>
													</span>
												</Link>
											))}
										</div>
									</details>
								);
							})}
						</div>
					</nav>
				) : null}
				<div className="mt-auto flex shrink-0 flex-col items-start gap-2 pt-4">
					<nav
						aria-label="Social links"
						className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:flex-col lg:items-start lg:gap-1"
					>
						<a
							href="https://github.com/dhruvb26"
							target="_blank"
							rel="noopener noreferrer"
							className={socialLinkClass}
						>
							GitHub
							<span className={hoverArrowClass}>
								<ArrowUpRightIcon
									aria-hidden="true"
									className="size-4 shrink-0"
									strokeWidth={2.75}
								/>
							</span>
						</a>
						<a
							href="https://www.linkedin.com/in/dhruvb26/"
							target="_blank"
							rel="noopener noreferrer"
							className={socialLinkClass}
						>
							LinkedIn
							<span className={hoverArrowClass}>
								<ArrowUpRightIcon
									aria-hidden="true"
									className="size-4 shrink-0"
									strokeWidth={2.75}
								/>
							</span>
						</a>
						<Show when="signed-in" fallback={null}>
							<Link href="/lab/board" className={socialLinkClass}>
								Lab
							</Link>
						</Show>
					</nav>
				</div>
			</aside>
			<LabControls showHome={false} />
		</div>
	);
}
