"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
	{ id: "me", label: "Me" },
	{ id: "projects", label: "Projects" },
	{ id: "wiki", label: "Wiki" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function sectionFor(id: string): SectionId {
	if (id.startsWith("project-")) return "projects";
	if (id.startsWith("wiki")) return "wiki";
	return sections.some((section) => section.id === id) ? (id as SectionId) : "me";
}

/** Clean path for a section/subsection id, e.g. `project-foo` → `/projects/foo`. */
function pathForId(id: string): string {
	if (id === "me") return "/";
	if (id === "projects" || id === "wiki") return `/${id}`;
	if (id.startsWith("project-")) return `/projects/${id.slice("project-".length)}`;
	if (id.startsWith("wiki-")) return `/wiki/${id.slice("wiki-".length)}`;
	return "/";
}

/** Section/subsection id for a clean path, e.g. `/projects/foo` → `project-foo`. */
function idForPath(pathname: string): string | null {
	const [section, slug] = pathname.split("/").filter(Boolean);
	if (!section) return null;
	if (section === "me" && !slug) return "me";
	if (section === "projects") return slug ? `project-${slug}` : "projects";
	if (section === "wiki") return slug ? `wiki-${slug}` : "wiki";
	return null;
}

function targetIdFromUrl(): string | null {
	// Legacy hash links (e.g. /#project-foo) still work alongside clean paths.
	if (window.location.hash.length > 1) return window.location.hash.slice(1);
	return idForPath(window.location.pathname);
}

function setUrl(id: string, mode: "push" | "replace") {
	const url = `${pathForId(id)}${window.location.search}`;
	if (window.location.pathname === url && !window.location.hash) return;
	if (mode === "push") history.pushState(null, "", url);
	else history.replaceState(null, "", url);
}

function reveal(id: string, behavior: ScrollBehavior) {
	const element = document.getElementById(id);
	if (!element) return false;
	if (element instanceof HTMLDetailsElement) element.open = true;
	element.scrollIntoView({ behavior, block: "start" });
	return true;
}

export function HomeSectionNav() {
	const [activeSection, setActiveSection] = useState<SectionId>("me");
	// While a deep link is being landed on, don't let scroll tracking
	// overwrite its URL with whatever section happens to be at the top.
	const landingOnDeepLink = useRef(false);

	// Deep links: land directly on the linked section/subsection (opening a
	// linked project) instead of leaving the reader at the top of the page.
	useEffect(() => {
		function revealLinkedSection() {
			const id = targetIdFromUrl();
			if (!(id && document.getElementById(id))) {
				landingOnDeepLink.current = false;
				return;
			}
			landingOnDeepLink.current = true;
			// Run after layout settles so the target isn't measured mid-render.
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					reveal(id, "auto");
					setUrl(id, "replace");
					landingOnDeepLink.current = false;
				}),
			);
		}

		function handleClick(event: MouseEvent) {
			if (!(event.target instanceof Element)) return;

			const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
			if (anchor) {
				const id = anchor.hash.slice(1);
				if (!document.getElementById(id)) return;
				event.preventDefault();
				setUrl(id, "push");
				reveal(id, "smooth");
				return;
			}

			const summary = event.target.closest("summary");
			const details = summary?.parentElement;
			if (details instanceof HTMLDetailsElement && details.id.startsWith("project-")) {
				const id = details.id;
				setTimeout(() => setUrl(details.open ? id : "projects", "push"), 0);
			}
		}

		document.addEventListener("click", handleClick);
		window.addEventListener("hashchange", revealLinkedSection);
		window.addEventListener("popstate", revealLinkedSection);
		revealLinkedSection();
		return () => {
			document.removeEventListener("click", handleClick);
			window.removeEventListener("hashchange", revealLinkedSection);
			window.removeEventListener("popstate", revealLinkedSection);
		};
	}, []);

	// Keep the address bar pointing at whatever section/subsection is on
	// screen, so copying the URL at any moment shares a direct link to it.
	useEffect(() => {
		let frame: number | null = null;

		function updateActiveSection() {
			frame = null;
			const marker = window.innerHeight * 0.35;
			let activeId: string | null = null;

			for (const element of document.querySelectorAll<HTMLElement>("main [id]")) {
				if (element.getBoundingClientRect().top <= marker) activeId = element.id;
			}
			if (!activeId) return;
			setActiveSection(sectionFor(activeId));
			if (!landingOnDeepLink.current) setUrl(activeId, "replace");
		}

		function scheduleUpdate() {
			if (frame === null) frame = requestAnimationFrame(updateActiveSection);
		}

		updateActiveSection();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		return () => {
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			if (frame !== null) cancelAnimationFrame(frame);
		};
	}, []);

	function scrollTo(id: SectionId) {
		setUrl(id, "push");
		reveal(id, "smooth");
	}

	return (
		<nav
			aria-label="Page sections"
			className="fixed right-5 top-5 z-40 rounded-full bg-background/80 p-1.5 backdrop-blur sm:right-8 sm:top-8"
		>
			<div className="flex flex-col items-end gap-1">
				{sections.map((section) => (
					<button
						key={section.id}
						type="button"
						onClick={() => scrollTo(section.id)}
						aria-label={`Scroll to ${section.label}`}
						aria-current={activeSection === section.id ? "location" : undefined}
						className="group flex size-4 items-center justify-center"
					>
						<span
							className={cn(
								"h-[3px] rounded-full transition-all duration-200",
								activeSection === section.id
									? "w-4 bg-muted-foreground/60"
									: "w-3 bg-muted-foreground/30 group-hover:w-3.5 group-hover:bg-muted-foreground/45",
							)}
						/>
					</button>
				))}
			</div>
		</nav>
	);
}
